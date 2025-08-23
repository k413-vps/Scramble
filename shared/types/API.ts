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
