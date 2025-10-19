import { RedisClientType } from "redis";
import { PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import {
    drawTilesRedis,
    getBagLength,
    placeActionBoardUpdate,
    pointsManaPlayerUpdate,
    setLastToDrawId,
    updateTurnHistoryAction,
} from "./RedisHelper";
import { HandlePlayReturn, HandleSacrificeReturn, HandleShuffleReturn, HandlePassReturn } from "./HelperTypes";
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

    const bagSizeBefore = await getBagLength(roomId, redisClient);

    const [_1, _2, drawTiles, { nextPlayerId, timeOfLastTurn }] = await Promise.all([
        placeActionBoardUpdate(redisClient, roomId, actionData.hand),
        pointsManaPlayerUpdate(redisClient, roomId, actionData.playerId, actionData.points, actionData.mana),
        drawTilesRedis(redisClient, roomId, actionData.playerId, actionData.hand),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    const bagSizeAfter = drawTiles.bagSize;
    const emptiedBag = bagSizeAfter === 0 && bagSizeBefore > 0;

    if (emptiedBag) {
        await setLastToDrawId(roomId, actionData.playerId, redisClient);
    }

    return {
        newHand: drawTiles.newHand,
        bagSize: bagSizeAfter,
        nextPlayerId,
        timeOfLastTurn,
        emptiedBag,
    };
}

export async function handlePass(
    actionData: PassAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<HandlePassReturn> {
    const { nextPlayerId, timeOfLastTurn } = await updateTurnHistoryAction(redisClient, roomId, actionData);

    return { nextPlayerId, timeOfLastTurn };
}

export async function handleShuffle(
    actionData: ShuffleAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<HandleShuffleReturn> {
    const negativesOnly = actionData.hand.filter((tile) => tile.enchantment === Enchantment.NEGATIVE);
    const bagSizeBefore = await getBagLength(roomId, redisClient);

    const [drawResponse, { nextPlayerId, timeOfLastTurn }] = await Promise.all([
        drawTilesRedis(redisClient, roomId, actionData.playerId, negativesOnly),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    const bagSizeAfter = drawResponse.bagSize;
    const emptiedBag = bagSizeAfter === 0 && bagSizeBefore > 0;

    if (emptiedBag) {
        await setLastToDrawId(roomId, actionData.playerId, redisClient);
    }

    return {
        newHand: drawResponse.newHand,
        bagSize: bagSizeAfter,
        nextPlayerId,
        timeOfLastTurn,
        emptiedBag,
    };
}

export async function handleWrite(actionData: WriteAction, roomId: string, redisClient: RedisClientType) {}

export async function handleSacrifice(
    actionData: SacrificeAction,
    roomId: string,
    redisClient: RedisClientType
): Promise<HandleSacrificeReturn> {
    const [_, { nextPlayerId, timeOfLastTurn }] = await Promise.all([
        pointsManaPlayerUpdate(redisClient, roomId, actionData.playerId, actionData.points, actionData.mana),
        updateTurnHistoryAction(redisClient, roomId, actionData),
    ]);

    return { nextPlayerId, timeOfLastTurn };
}
