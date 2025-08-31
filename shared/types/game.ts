import { Tile } from "./tiles";

export interface Game {
    players: Array<Player>;
    board: Array<Array<Tile | null | Blocked>>;
    enhancements: Array<Array<Enhancement>>;
    currentPlayerId: string;
    bag: Tile[];
    turnHistory: Action[];
    timePerTurn: number; // epoch time
    timeOfLastTurn: number; // epoch time
    dictionary: Dictionary;
    wildMode: boolean; // are tiles permanently boosted?
    points: LetterPoints;
    enableEnchantments: boolean;
    enableSpecialActions: boolean;
    public: boolean;
}

export interface Blocked {
    playerId: string;
}

export enum Enhancement {
    DOUBLE_LETTER = "2L",
    TRIPLE_LETTER = "3L",
    DOUBLE_WORD = "2W",
    TRIPLE_WORD = "3W",
    NONE = "",
    START = "*",
    MANA = "M",
}

export interface Player {
    id: string;
    name: string;
    hand: Array<Tile>;
    handSize: number;
    points: number;
    mana: number;
}

interface Action {
    playerId: string;
    cost: number; // how much mana the action costs
    points: number;
}

interface PlaceAction extends Action {
    // place something
    cost: 0;
    crystalBall: boolean;
    tiles: Tile[];
}

interface PassAction extends Action {
    // skip your turn
    cost: -3; // you gain 3 mana
    points: 0;
}

interface ShuffleAction extends Action {
    // throw away ALL your tiles and redraw
    cost: 0;
    points: 0;
}

interface WriteAction extends Action {
    // adds a new word to the dictionary that can be used for the rest of the game
    cost: 7;
    points: 0;
}

interface SacrificeAction extends Action {
    cost: -7; // you gain 10 mana
    points: -20; // you lose 20 points
}

export type Dictionary = {
    [word: string]: true;
};

export type LetterPoints = {
    [character: string]: number;
};
