import { RedisClientType } from "redis";
import { PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import { drawTilesRedis, placeActionBoardUpdate, pointsManaPlayerUpdate, updateTurnHistoryAction } from "./RedisHelper";
import { HandlePlayReturn, HandleShuffleReturn } from "./HelperTypes";
import { Enchantment } from "shared/types/tiles";

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
        pointsManaPlayerUpdate(redisClient, roomId, actionData.playerId, actionData.points, actionData.mana),
        drawTilesRedis(redisClient, roomId, actionData.playerId, actionData.hand),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    return { newHand: drawTiles.newHand, bagSize: drawTiles.bagSize, nextPlayerId };
}

export async function handlePass(
    actionData: PassAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<string> {
    const nextPlayerId = await updateTurnHistoryAction(redisClient, roomId, actionData);

    return nextPlayerId;
}

export async function handleShuffle(
    actionData: ShuffleAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<HandleShuffleReturn> {
    const negativesOnly = actionData.hand.filter((tile) => tile.enchantment === Enchantment.NEGATIVE);
    const [drawResponse, nextPlayerId] = await Promise.all([
        drawTilesRedis(redisClient, roomId, actionData.playerId, negativesOnly),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    return {
        newHand: drawResponse.newHand,
        bagSize: drawResponse.bagSize,
        nextPlayerId,
    };
}

export async function handleWrite(actionData: WriteAction, roomId: string, redisClient: RedisClientType) {}

export async function handleSacrifice(
    actionData: SacrificeAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<string> {
    const [_, nextPlayerId] = await Promise.all([
        pointsManaPlayerUpdate(redisClient, roomId, actionData.playerId, actionData.points, actionData.mana),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    return nextPlayerId;
}
