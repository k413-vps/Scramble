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
}

export interface HandlePlayReturn {
    newHand: Tile[];
    bagSize: number;
    nextPlayerId: string;
}

    
