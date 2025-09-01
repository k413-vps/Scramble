import { DictionaryEnum, Enhancement } from "./game";
import { LetterCount, LetterPoints } from "./misc";
import { TestMessageToClient } from "./SocketMessages";

export interface PingResponse {
    message: string;
}

export interface MathRequest {
    num1: number;
    num2: number;
}

export interface MathResponse {
    num: number;
}

export interface RandomNumResponse {
    num: number;
}

export interface RedisConnectedResponse {
    connected: boolean;
}

export interface ChatMsgsRequest {
    roomId: string;
}

export interface ChatMsgsResponse {
    messages: TestMessageToClient[];
}

export interface ErrorResponse {
    errMsg: string;
}

export interface CreateGameRequest {
    enhancements: Enhancement[][];
    letterFrequency: LetterCount;
    timePerTurn: number;
    wildMode: boolean;
    points: LetterPoints;
    enableEnchantments: boolean;
    enableSpecialActions: boolean;
    public: boolean;
    handSize: number;
    seed: number | "";
    dictionary: DictionaryEnum;
}

export interface CreateGameResponse {
    roomId: string;
}
