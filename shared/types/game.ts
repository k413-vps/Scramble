import { LetterCount, LetterPoints } from "./misc";
import { Spell } from "./spells";
import { Tile } from "./tiles";

export interface ServerSideGame {
    players: ServerSidePlayer[]; // player turn goes in this order
    board: Array<Array<Tile | null | Blocked>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    bag: string[];
    turnHistory: [Action, string][]; // array of tuples
    timePerTurn: number; // epoch time, 0 for unlimited
    timeOfLastTurn: number; // epoch time
    dictionary: DictionaryEnum;
    wildMode: boolean; // are tiles permanently boosted?
    points: LetterPoints;
    enableEnchantments: boolean;
    enableSpecialActions: boolean;
    public: boolean;
    handSize: number;
    seed: number;
    randomSeed: boolean;
}

export interface ClientSideGame {
    players: ClientSidePlayer[]; // player turn goes in this order
    board: Array<Array<Tile | null | Blocked>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    hand: Tile[];
    turnHistory: [Action, string][]; // array of tuples
    timePerTurn: number; // epoch time, 0 for unlimited
    timeOfLastTurn: number; // epoch time
    dictionary: DictionaryEnum;
    wildMode: boolean; // are tiles permanently boosted?
    points: LetterPoints;
    enableEnchantments: boolean;
    enableSpecialActions: boolean;
    public: boolean;
    handSize: number; // not sure if hand size of player or default hand size
    seed: number;
    randomSeed: boolean;
    purchasedSpells: Array<Spell>; // one time spells only
}

export interface ServerSidePlayer {
    id: string;
    name: string;
    hand: Array<Tile>;
    points: number;
    mana: number;
    purchasedSpells: Array<Spell>; // one time spells only
}

export interface ClientSidePlayer {
    id: string;
    name: string;
    points: number;
    mana: number;
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
    DOUBLE_START = "2*",
    MANA = "M",
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

export type Dictionary = string[];

export enum DictionaryEnum {
    twl06 = "twl06",
    sowpods = "sowpods",
}
