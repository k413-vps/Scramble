export interface Tile {
    letter: string;
    points: number;
    position: null | Position; // null if in hand, position if played
    enchantment: Enchantment; // enchantment is chosen when drawn by the player to account for Hone
}

export enum Enchantment {
    BASE,
    FOIL, // + 7
    HOLOGRAPHIC, // + 5 each time, including first time
    POLYCHROME, // score by *1.5
    NEGATIVE, // can't be discarded by Grabber. Don't count towards hand size
}

export type EnchantmentRate = {
    [key in Enchantment]: number;
};

export interface Position {
    row: number;
    col: number;
}
