import { RedisClientType } from "redis";
import { PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import { drawTilesRedis, placeActionBoardUpdate, placeActionPlayerUpdate, updateTurnHistory } from "./RedisHelper";
import { HandlePlayReturn } from "./HelperTypes";


export async function handlePlay(
    actionData: PlaceAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<HandlePlayReturn> {
    // update board
    // update player points
    // update current player hand
    // update turn history

    const [_1, _2, drawTiles, nextPlayerId] = await Promise.all([
        placeActionBoardUpdate(redisClient, roomId, actionData.hand),
        placeActionPlayerUpdate(redisClient, roomId, actionData.playerId, actionData.points, actionData.mana),
        drawTilesRedis(redisClient, roomId, actionData.playerId, actionData.hand),
        updateTurnHistory(redisClient, roomId, actionData),
    ]);

    return {newHand: drawTiles.newHand, bagSize: drawTiles.bagSize, nextPlayerId};
}

export async function handlePass(actionData: PassAction, roomId: string, redisClient: RedisClientType) {}

export async function handleShuffle(actionData: ShuffleAction, roomId: string, redisClient: RedisClientType) {}

export async function handleWrite(actionData: WriteAction, roomId: string, redisClient: RedisClientType) {}

export async function handleSacrifice(actionData: SacrificeAction, roomId: string, redisClient: RedisClientType) {}
