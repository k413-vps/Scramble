import { Tile } from "./tiles";

export enum ActionType {
    PLAY = "PLAY",
    PASS = "PASS",
    SHUFFLE = "SHUFFLE",
    WRITE = "WRITE",
    SACRIFICE = "SACRIFICE",
}

// this interface represents info about a possible action a player can take
export interface Action {
    type: ActionType;
    description: string;
    cost: number; // mana cost
}

export const actions: Record<ActionType, Action> = {
    [ActionType.PLAY]: {
        type: ActionType.PLAY,
        description: "Place tiles and score points.",
        cost: 0,
    },
    [ActionType.PASS]: {
        type: ActionType.PASS,
        description: "Skip your turn without any penalty.",
        cost: 0,
    },
    [ActionType.SHUFFLE]: {
        type: ActionType.SHUFFLE,
        description: "Discard your entire hand and draw new tiles.",
        cost: 0,
    },
    [ActionType.WRITE]: {
        type: ActionType.WRITE,
        description: "Add a new word to the dictionary for 7 mana.",
        cost: 7,
    },
    [ActionType.SACRIFICE]: {
        type: ActionType.SACRIFICE,
        description: "Lose 20 points but gain 7 mana.",
        cost: 0,
    },
};

// this interface represents a specific action taken by a player
export interface ActionData {
    playerId: string;
    points: number; // points gained
    mana: number; // mana gained
    type: ActionType;
}

export interface PlaceAction extends ActionData {
    type: ActionType.PLAY;
    hand: Tile[];
}

export interface PassAction extends ActionData {
    type: ActionType.PASS;
}

export interface ShuffleAction extends ActionData {
    type: ActionType.SHUFFLE;
}

export interface WriteAction extends ActionData {
    type: ActionType.WRITE;
}

export interface SacrificeAction extends ActionData {
    type: ActionType.SACRIFICE;
}
