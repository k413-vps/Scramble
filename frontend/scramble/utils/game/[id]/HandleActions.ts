import { ActionType, PlaceAction } from "shared/types/actions";
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

export function handlePass() {
    // Implement pass logic here
}

export function handleShuffle() {
    // Implement shuffle logic here
}

export function handleWrite() {
    // Implement write logic here
}

export function handleSacrifice() {
    // Implement sacrifice logic here
}
