import { createClient, RedisClientType } from "redis";
import seedrandom from "seedrandom";
import { shuffle } from "shared/functions/util";
import { ServerSidePlayer, ServerSideGame, BoardTile, BoardTileType, ServerPlayerMap } from "shared/types/game";
import { drawTiles } from "./GameLogic";
import { Tile } from "shared/types/tiles";
import { LetterPoints } from "shared/types/misc";

export function RedisSetup(redisUrl: string): [RedisClientType, boolean] {
    const redisClient: RedisClientType = createClient({
        url: redisUrl,
    });
    let success = false;

    try {
        redisClient.connect();

        console.log("connected to redis");

        redisClient.json.set(
            "test_chat",
            "$",
            {},
            {
                NX: true,
            }
        ); // create empty dictionary, if it doesn't exist already

        // idk why i made chats this way but its too late to change now :/
        success = true;
    } catch (err) {
        console.log("can't connect to redis :/");
    }

    return [redisClient, success];
}

function generateRandomId(length: number): string {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = Array(length)
        .fill(0)
        .map((_, i) => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("");

    return id;
}

export async function roomExists(id: string, redisClient: RedisClientType): Promise<boolean> {
    return (await redisClient.exists(`games:${id}`)) == 1;
}

export async function uniqueRoomId(redisClient: RedisClientType): Promise<string> {
    let id = generateRandomId(5);

    while (await roomExists(id, redisClient)) {
        id = generateRandomId(5);
    }

    return id;
}

export async function createRoom(redisClient: RedisClientType, game: ServerSideGame): Promise<string> {
    const roomId = await uniqueRoomId(redisClient);
    const plainJSON = JSON.parse(JSON.stringify(game));
    const key = `games:${roomId}`;
    const ttlInSeconds = 86400;

    // console.log("stringy create room", plainJSON);

    await redisClient.json.set(key, "$", plainJSON);
    await redisClient.expire(key, ttlInSeconds);

    return roomId;
}

export async function getRoom(id: string, redisClient: RedisClientType): Promise<ServerSideGame | null> {
    if (!(await roomExists(id, redisClient))) {
        return null;
    }

    const game: ServerSideGame = (await redisClient.json.get(`games:${id}`)) as unknown as ServerSideGame;

    return game;
}

export async function getPlayers(redisClient: RedisClientType, roomId: string): Promise<ServerSidePlayer[]> {
    const key = `games:${roomId}`;
    const path = ".players";

    const players = (await redisClient.json.get(key, { path })) as unknown as ServerSidePlayer[];
    return players;
}

export async function checkPlayerExists(
    redisClient: RedisClientType,
    userId: string,
    roomId: string
): Promise<boolean> {
    // const players = await getPlayers(redisClient, roomId);

    // return players.some((player) => player.id === userId);
    const key = `games:${roomId}`;
    const path = `.players.${userId}`;
    const res = (await redisClient.sendCommand(["JSON.TYPE", key, path])) as unknown as string;

    return res !== null;
}

export async function addPlayer(
    redisClient: RedisClientType,
    player: ServerSidePlayer,
    playerId: string,
    roomId: string
): Promise<number> {
    console.log("adding player");
    const key = `games:${roomId}`;

    const playersPath = `players.${playerId}`;

    await redisClient.json.set(key, playersPath, player as any);

    const size = await redisClient.sendCommand(["JSON.OBJLEN", key, "players"]);
    console.log("num players", size);
    return size as any as number;
}

export async function setOwner(redisClient: RedisClientType, userId: string, roomId: string): Promise<void> {
    const key = `games:${roomId}`;

    await redisClient.json.set(key, ".ownerId", userId);
}

export async function drawTilesRedis(redisClient: RedisClientType, roomId: string, playerId: string): Promise<Tile[]> {
    return [];
}

// returns players, turn order, and number of tiles left in bag
export async function startGame(
    redisClient: RedisClientType,
    roomId: string
): Promise<[ServerPlayerMap, string[], number]> {
    const key = `games:${roomId}`;

    const result = (await redisClient.sendCommand([
        "JSON.GET",
        key,
        ".players",
        ".bag",
        ".handSize",
        ".seed",
        ".points",
    ])) as unknown as string;

    const json = JSON.parse(result);

    const players = json[".players"] as ServerPlayerMap;
    const bag = json[".bag"] as string[];
    const handSize = json[".handSize"] as number;
    const seed = json[".seed"] as number;
    const points = json[".points"] as LetterPoints;

    const rng = seedrandom(seed.toString());

    const playerIds = Object.keys(players);
    const playerOrder = shuffle(playerIds, rng);

    for (const playerId of playerOrder) {
        const player = players[playerId];
        const tiles = await drawTiles(bag, player.hand, handSize, player.purchasedSpells, seed, points);
        player.hand.push(...tiles);
    }

    const currentPlayerId = playerOrder[0];

    const gameStarted = true;

    await redisClient.json.set(key, ".gameStarted", gameStarted);
    await redisClient.json.set(key, ".currentPlayerId", currentPlayerId);
    await redisClient.json.set(key, ".bag", JSON.parse(JSON.stringify(bag)));
    await redisClient.json.set(key, ".playerTurnOrder", playerOrder);
    await redisClient.json.set(key, ".players", JSON.parse(JSON.stringify(players)));

    return [players, playerOrder, bag.length];
}

export async function placeActionBoardUpdate(
    redisClient: RedisClientType,
    roomId: string,
    hand: Tile[]
): Promise<void> {
    const key = `games:${roomId}`;

    const boardRaw = (await redisClient.sendCommand(["JSON.GET", key, ".board"])) as unknown as string;

    const boardObj = JSON.parse(boardRaw) as Array<Array<BoardTile | null>>;

    const plannedTiles = hand.filter((tile) => tile.position !== null);

    for (const tile of plannedTiles) {
        const pos = tile.position!;
        tile.placed = true;

        const boardTile: BoardTile = {
            type: BoardTileType.TILE,
            tile: tile,
        };

        boardObj[pos.row][pos.col] = boardTile;
    }

    await redisClient.json.set(key, ".board", JSON.parse(JSON.stringify(boardObj)));
}

export async function placeActionPlayerUpdate(
    redisClient: RedisClientType,
    roomId: string,
    playerId: string,
    points: number,
    mana: number,
    hand: Tile[]
): Promise<void> {
    const key = `games:${roomId}`;

    const players = (await redisClient.sendCommand(["JSON.GET", key, ".players"])) as unknown as string;
    const playersObj = JSON.parse(players) as ServerPlayerMap;
}
