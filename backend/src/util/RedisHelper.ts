import { createClient, RedisClientType } from "redis";
import seedrandom from "seedrandom";
import { shuffle } from "shared/functions/util";
import { ServerSidePlayer, ServerSideGame, BoardTile, BoardTileType, ServerPlayerMap } from "shared/types/game";
import { drawTiles } from "./GameLogic";
import { Tile } from "shared/types/tiles";
import { LetterPoints } from "shared/types/misc";
import { ActionData, ActionType, PlaceAction } from "shared/types/actions";
import { DrawTilesReturn, RedisSetupReturn, StartGameReturn } from "./HelperTypes";

export function RedisSetup(redisUrl: string): RedisSetupReturn {
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

    return { redisClient, success };
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
    const key = `games:${roomId}`;

    const playersPath = `players.${playerId}`;

    await redisClient.json.set(key, playersPath, player as any);

    const size = await redisClient.sendCommand(["JSON.OBJLEN", key, "players"]);
    return size as any as number;
}

export async function setOwner(redisClient: RedisClientType, userId: string, roomId: string): Promise<void> {
    const key = `games:${roomId}`;

    await redisClient.json.set(key, ".ownerId", userId);
}

// return new hand with drawn tiles, and number of tiles left in bag
export async function drawTilesRedis(
    redisClient: RedisClientType,
    roomId: string,
    playerId: string,
    currentHand?: Tile[]
): Promise<DrawTilesReturn> {
    const key = `games:${roomId}`;

    const result = (await redisClient.sendCommand([
        "JSON.GET",
        key,
        "bag",
        "handSize",
        `players.${playerId}.purchasedSpells`,
        `players.${playerId}.hand`,
        "seed",
        "points",
    ])) as unknown as string;

    const json = JSON.parse(result);

    const bag = json["bag"] as string[];
    const handSize = json["handSize"] as number;
    const purchasedSpells = json[`players.${playerId}.purchasedSpells`] as Array<any>;
    const seed = json["seed"] as number;
    const points = json["points"] as LetterPoints;

    let hand = (currentHand ?? json[`players.${playerId}.hand`]) as Tile[];
    hand = hand.filter((tile) => !tile.placed);

    console.log("drawing tiles", hand);
    const newTiles = await drawTiles(bag, hand, handSize, purchasedSpells, seed, points);
    console.log("after drawing tiles", hand);
    console.log("new tiles", newTiles);

    hand.push(...newTiles);
    await redisClient.sendCommand([
        "JSON.MSET",
        key,
        "bag",
        JSON.stringify(bag),
        key,
        `players.${playerId}.hand`,
        JSON.stringify(hand),
    ]);

    return { newHand: hand, bagSize: bag.length };
}

// returns players, turn order, and number of tiles left in bag
export async function startGame(redisClient: RedisClientType, roomId: string): Promise<StartGameReturn> {
    const key = `games:${roomId}`;

    const result = await redisClient.sendCommand(["JSON.GET", key, "players", "bag", "handSize", "seed", "points"]);

    const json = JSON.parse(result.toString());

    const players = json["players"] as ServerPlayerMap;
    const bag = json["bag"] as string[];
    const handSize = json["handSize"] as number;
    const seed = json["seed"] as number;
    const points = json["points"] as LetterPoints;

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

    const command = [
        "JSON.MSET",
        key,
        "gameStarted",
        JSON.stringify(gameStarted),
        key,
        "currentPlayerId",
        JSON.stringify(currentPlayerId),
        key,
        "bag",
        JSON.stringify(bag),
        key,
        "playerTurnOrder",
        JSON.stringify(playerOrder),
        key,
        "players",
        JSON.stringify(players),
    ];

    await redisClient.sendCommand(command);

    return { players, playerOrder, bagSize: bag.length };
}

export async function placeActionBoardUpdate(
    redisClient: RedisClientType,
    roomId: string,
    hand: Tile[]
): Promise<void> {
    const key = `games:${roomId}`;

    const plannedTiles = hand.filter((tile) => tile.position !== null);

    const command = ["JSON.MSET"];

    for (const tile of plannedTiles) {
        const pos = tile.position!;
        tile.placed = true;

        const boardTile: BoardTile = {
            type: BoardTileType.TILE,
            tile: tile,
        };

        command.push(key, `board[${pos.row}][${pos.col}]`, JSON.stringify(boardTile));
    }

    await redisClient.sendCommand(command);
}

export async function pointsManaPlayerUpdate(
    redisClient: RedisClientType,
    roomId: string,
    playerId: string,
    points: number,
    mana: number
): Promise<void> {
    const key = `games:${roomId}`;

    await Promise.all([
        redisClient.sendCommand(["JSON.NUMINCRBY", key, `players.${playerId}.points`, `${points}`]),
        redisClient.sendCommand(["JSON.NUMINCRBY", key, `players.${playerId}.mana`, `${mana}`]),
    ]);
}

export async function updateTurnHistory(
    redisClient: RedisClientType,
    roomId: string,
    actionData: ActionData
): Promise<string> {
    const key = `games:${roomId}`;
    const playerId = actionData.playerId;

    const result = (await redisClient.sendCommand(["JSON.GET", key, "playerTurnOrder"])) as unknown as string;

    const json = JSON.parse(result);

    // single get so its only the list, not a json
    const turnOrder = json as string[];

    const currentIndex = turnOrder.indexOf(playerId);
    const nextIndex = (currentIndex + 1) % turnOrder.length;
    const nextPlayerId = turnOrder[nextIndex];

    if (actionData.type == ActionType.PLAY) {
        const placeAction = actionData as PlaceAction;
        placeAction.hand = placeAction.hand.filter((tile) => tile.placed);
        await Promise.all([
            redisClient.json.arrAppend(`games:${roomId}`, "turnHistory", JSON.parse(JSON.stringify(placeAction))),
            redisClient.json.set(`games:${roomId}`, "currentPlayerId", nextPlayerId),
        ]);
    } else {
        await Promise.all([
            redisClient.json.arrAppend(`games:${roomId}`, "turnHistory", JSON.parse(JSON.stringify(actionData))),
            redisClient.json.set(`games:${roomId}`, "currentPlayerId", nextPlayerId),
        ]);
    }

    return nextPlayerId;
}
