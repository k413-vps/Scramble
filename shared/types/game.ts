import { ActionData } from "./actions";
import { LetterCount, LetterPoints } from "./misc";
import { Spell } from "./spells";
import { Position, Tile } from "./tiles";

export interface ServerSideGame {
    players: ServerSidePlayer[]; // player turn goes in this order
    board: Array<Array<BoardTile | null>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    bag: string[];
    turnHistory: [ActionData, string][]; // array of tuples
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
    gameStarted: boolean;
    ownerId: string;
}

export interface ClientSideGame {
    players: ClientSidePlayer[]; // player turn goes in this order
    board: Array<Array<BoardTile | null>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    hand: Tile[];
    turnHistory: [ActionData, string][]; // array of tuples
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
    tilesRemaining: number;
    gameStarted: boolean;
    ownerId: string;
}

export interface BoardTile {
    type: "tile" | "blocked";
    tile: Tile | Blocked;
}

export interface ServerSidePlayer {
    id: string;
    profilePicture: string;
    name: string;
    hand: Array<Tile>;
    points: number;
    mana: number;
    purchasedSpells: Array<Spell>; // one time spells only
}

export interface ClientSidePlayer {
    id: string;
    profilePicture: string;
    name: string;
    points: number;
    mana: number;
}

export interface Blocked {
    playerId: string;
    position: Position;
    playerImage: string; // profile picture of the player who placed it
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

export type Dictionary = string[];

export enum DictionaryEnum {
    twl06 = "twl06",
    sowpods = "sowpods",
}
