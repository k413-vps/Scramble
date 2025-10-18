import { ActionType, PassAction, PlaceAction, SacrificeAction, ShuffleAction } from "shared/types/actions";
import { Socket } from "socket.io-client";
import { ActionToServer } from "shared/types/SocketMessages";
import { Tile } from "shared/types/tiles";

export function handlePlay(socket: Socket, hand: Tile[], currentPlayerId: string, points: number, manaGain: number) {
    const actionData: PlaceAction = {
        type: ActionType.PLAY,
        hand: hand,
        playerId: currentPlayerId,
        points: points,
        mana: manaGain,
    };

    const message: ActionToServer = {
        actionData: actionData,
    };

    socket.emit("action", message);
}

export function handlePass(socket: Socket, currentPlayerId: string) {

    const actionData: PassAction = {
        type: ActionType.PASS,
        playerId: currentPlayerId,
        points: 0,
        mana: 0
    }

    const message: ActionToServer = {
        actionData: actionData,
    };
    socket.emit("action", message);
}

export function handleShuffle(socket: Socket, hand: Tile[], currentPlayerId: string) {

    const actionData: ShuffleAction = {
        type: ActionType.SHUFFLE,
        hand: hand,
        playerId: currentPlayerId,
        points: 0,
        mana: 0
    }

    const message: ActionToServer = {
        actionData: actionData,
    };
    socket.emit("action", message);
}


export function handleWrite() {
    // Implement write logic here
}

export function handleSacrifice(socket: Socket, currentPlayerId: string) {
    const actionData: SacrificeAction = {
        type: ActionType.SACRIFICE,
        playerId: currentPlayerId,
        points: -20,
        mana: 7
    }

    const message: ActionToServer = {
        actionData: actionData,
    };

    socket.emit("action", message);
}
