import { ActionData } from "./actions";
import { LetterPoints } from "./misc";
import { Spell, SpellData } from "./spells";
import { Position, Tile } from "./tiles";

export enum TurnType {
    SPELL = "SPELL",
    ACTION = "ACTION",
}
export interface Turn {
    type: TurnType;
}

export interface SpellTurn extends Turn {
    type: TurnType.SPELL;
    spellData: SpellData;
}

export interface ActionTurn extends Turn {
    type: TurnType.ACTION;
    actionData: ActionData;
}

export type ServerPlayerMap = { [id: string]: ServerSidePlayer };
export interface ServerSideGame {
    playerTurnOrder: string[]; // player turn goes in this order
    players: ServerPlayerMap;
    board: Array<Array<BoardTile | null>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    bag: string[];
    turnHistory: HistoryElement[];
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

export type ClientPlayerMap = { [id: string]: ClientSidePlayer };
export interface ClientSideGame {
    playerTurnOrder: string[]; // player turn goes in this order
    players: ClientPlayerMap;
    board: Array<Array<BoardTile | null>>;
    enhancements: Enhancement[][];
    currentPlayerId: string;
    hand: Tile[];
    turnHistory: HistoryElement[];
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

export enum HistoryType {
    ACTION = "ACTION",
    SPELL = "SPELL",
}

export interface HistoryElement {
    type: HistoryType;
}

export interface ActionHistory extends HistoryElement {
    type: HistoryType.ACTION;
    actionData: ActionData;
}

export interface SpellHistory extends HistoryElement {
    type: HistoryType.SPELL;
    spellData: SpellData;
}

export enum BoardTileType {
    TILE = "tile",
    BLOCKED = "blocked",
}

export interface BoardTile {
    type: BoardTileType;
    tile: Tile | Blocked;
}

export interface ServerSidePlayer {
    profilePicture: string;
    name: string;
    hand: Array<Tile>;
    points: number;
    mana: number;
    purchasedSpells: Array<Spell>; // one time spells only
}

export interface ClientSidePlayer {
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
    NONE = "  ",
    START = "**",
    DOUBLE_START = "2*",
    MANA = "MM",
}

export type Dictionary = Set<string>;

export enum DictionaryEnum {
    twl06 = "twl06",
    sowpods = "sowpods",
}
