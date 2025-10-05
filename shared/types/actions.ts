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

export const actions: Action[] = [
    {
        type: ActionType.PLAY,
        description: "Place tiles and score points.",
        cost: 0,
    },
    {
        type: ActionType.PASS,
        description: "Skip your turn without any penalty.",
        cost: 0,
    },
    {
        type: ActionType.SHUFFLE,
        description: "Discard your entire hand and draw new tiles.",
        cost: 0,
    },
    {
        type: ActionType.WRITE,
        description: "Add a new word to the dictionary.",
        cost: 7,
    },
    {
        type: ActionType.SACRIFICE,
        description: "Lose 20 points but gain 7 mana.",
        cost: 0,
    },
];

// this interface represents a specific action taken by a player
export interface ActionData {
    playerId: string;
    points: number; // points gained
    mana: number; // mana gained
    type: ActionType;
}

export interface PlaceAction extends ActionData {
    type: ActionType.PLAY;
    crystalBall: boolean;
    tiles: Tile[];
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
