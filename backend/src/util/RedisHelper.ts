import { createClient, RedisClientType } from "redis";
import { ServerSideGame } from "shared/types/game";

export function RedisSetup(redisUrl: string): [RedisClientType, boolean] {
    const redisClient: RedisClientType = createClient({
        url: redisUrl,
    });
    let success = false

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
    const key = `games:${roomId}`
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

    const jsonString: string = (await redisClient.json.get(`games:${id}`)) as string;
    const game: ServerSideGame = JSON.parse(jsonString);
    return game;
}
