import { createClient, RedisClientType } from "redis";
import seedrandom from "seedrandom";
import { shuffle } from "shared/functions/util";
import { ServerSidePlayer, ServerSideGame } from "shared/types/game";
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
    const players = await getPlayers(redisClient, roomId);

    return players.some((player) => player.id === userId);
}

export async function addPlayer(
    redisClient: RedisClientType,
    player: ServerSidePlayer,
    roomId: string
): Promise<number> {
    const key = `games:${roomId}`;

    const path = ".players";

    const size = await redisClient.json.arrAppend(key, path, player as any);

    return size as number;
}

export async function setOwner(redisClient: RedisClientType, userId: string, roomId: string): Promise<void> {
    const key = `games:${roomId}`;

    await redisClient.json.set(key, ".ownerId", userId);
}

export async function drawTilesRedis(redisClient: RedisClientType, roomId: string, playerId: string): Promise<Tile[]> {
    return [];
}

export async function startGame(redisClient: RedisClientType, roomId: string): Promise<[ServerSidePlayer[], number]> {
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

    const players = json[".players"] as ServerSidePlayer[];
    const bag = json[".bag"] as string[];
    const handSize = json[".handSize"] as number;
    const seed = json[".seed"] as number;
    const points = json[".points"] as LetterPoints;

    const rng = seedrandom(seed.toString());

    const shufflePlayers = shuffle(players, rng);

    for (const player of shufflePlayers) {
        const tiles = await drawTiles(bag, player.hand, handSize, player.purchasedSpells, seed, points);
        player.hand.push(...tiles);
    }

    const currentPlayerId = shufflePlayers[0].id;

    const gameStarted = true;

    await redisClient.json.set(key, ".gameStarted", gameStarted);
    await redisClient.json.set(key, ".currentPlayerId", currentPlayerId);
    await redisClient.json.set(key, ".players", JSON.parse(JSON.stringify(shufflePlayers)));
    await redisClient.json.set(key, ".bag", JSON.parse(JSON.stringify(bag)));

    return [shufflePlayers, bag.length];
}
