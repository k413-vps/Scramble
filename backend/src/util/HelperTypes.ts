import { RedisClientType } from "redis";
import { ServerPlayerMap } from "shared/types/game";
import { Tile } from "shared/types/tiles";

export interface RedisSetupReturn {
    redisClient: RedisClientType;
    success: boolean;
}

export interface DrawTilesReturn {
    newHand: Tile[];
    bagSize: number;
}

export interface StartGameReturn {
    players: ServerPlayerMap;
    playerOrder: string[];
    bagSize: number;
    timeOfLastTurn: number;
}

export interface HandlePlayReturn {
    newHand: Tile[];
    bagSize: number;
    nextPlayerId: string;
    timeOfLastTurn: number;
    emptiedBag: boolean;
}

export interface HandlePassReturn {
    nextPlayerId: string;
    timeOfLastTurn: number;
}
export interface HandleShuffleReturn {
    newHand: Tile[];
    bagSize: number;
    nextPlayerId: string;
    timeOfLastTurn: number;
    emptiedBag: boolean;
}

export interface HandleSacrificeReturn {
    nextPlayerId: string;
    timeOfLastTurn: number;
}

export interface TurnHistoryActionReturn {
    nextPlayerId: string;
    timeOfLastTurn: number;
}
