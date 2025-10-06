import { RedisClientType } from "redis";
import { PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";

export function handlePlay(actionData: PlaceAction, roomId: string, redisClient: RedisClientType) {

    // update board
    const tiles = actionData.hand;
    // update player points and mana and hand
    // update current player
    // update turn history

}

export function handlePass(actionData: PassAction,  roomId: string, redisClient: RedisClientType) {}

export function handleShuffle(actionData: ShuffleAction, roomId: string, redisClient: RedisClientType) {}

export function handleWrite(actionData: WriteAction, roomId: string, redisClient: RedisClientType) {}

export function handleSacrifice(actionData: SacrificeAction, roomId: string, redisClient: RedisClientType) {}
