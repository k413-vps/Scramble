import { ActionData } from "./actions";
import { ClientSidePlayer } from "./game";
import { Tile } from "./tiles";

export interface TestMessageToClient {
    message: string;
    username: string;
}

export interface TestMessageToServer {
    message: string;
    username: string;
}

export interface JoinToServer {
    name: string;
    profilePicture: string;
}

export interface JoinToClient {
    player: ClientSidePlayer;
    playerId: string;
    owner: boolean;
}

export interface StartToServer {}

export interface StartToClient {
    // players: ClientSidePlayer[];
    turnOrder: string[];
    hand: Tile[];
    tilesRemaining: number;
}

export interface ActionToServer {
    actionData: ActionData;
}

export interface ActionToClient {
    actionData: ActionData;
}