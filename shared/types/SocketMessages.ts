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
    owner: boolean;
}

export interface StartToServer {}

export interface StartToClient {
    players: ClientSidePlayer[];
    hand: Tile[];
    tilesRemaining: number;
}
