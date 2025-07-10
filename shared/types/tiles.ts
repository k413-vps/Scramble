export interface Tile {
    letter: string;
    points: number;
    position: null | Position; // null if in hand, position if played
    enchantment: null | Enchantment; // enchantment is chosen when drawn by the player to account for Hone
}

export enum Enchantment {
    BASE,
    HOLOGRAPHIC,
    POLYCHROME,
    STEEL,
}

export interface Position {
    row: number;
    col: number;
}