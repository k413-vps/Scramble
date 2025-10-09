export interface Spell {
    cost: number;
    turn: boolean; // does it need to be your turn when you cast this spell?
    type: SpellType;
    description: string;
}

export enum SpellType {
    PAINTBRUSH = "PaintBrush",
    BLOCK = "Block",
    CURSE = "Curse",
    GRABBER = "Grabber",
    PICTOGRAPH = "Pictograph",
    PETROGLYPH = "Petroglyph",
    HIEROGLYPH = "Hieroglyph",
    HONE = "Hone",
    MANIFEST = "Manifest",
    SWAP = "Swap",
}

export interface SpellData {
    playerId: string;
    points: number; // points gained
    type: SpellType;
}

export const spells: Record<SpellType, Spell> = {
    [SpellType.PAINTBRUSH]: {
        cost: 12,
        turn: false,
        type: SpellType.PAINTBRUSH,
        description: "Permanently increases your hand size by 1.",
    },
    [SpellType.BLOCK]: {
        cost: 10,
        turn: false,
        type: SpellType.BLOCK,
        description: "Block a square from being played.",
    },
    [SpellType.CURSE]: {
        cost: 7,
        turn: false,
        type: SpellType.CURSE,
        description: "Square will have a base score of -5.",
    },
    [SpellType.GRABBER]: {
        cost: 5,
        turn: false,
        type: SpellType.GRABBER,
        description: "Force a player to lose all their tiles and redraw.",
    },
    [SpellType.PICTOGRAPH]: {
        cost: 3,
        turn: false,
        type: SpellType.PICTOGRAPH,
        description: "Draw a negative letter worth 1 - 3 points.",
    },
    [SpellType.PETROGLYPH]: {
        cost: 5,
        turn: false,
        type: SpellType.PETROGLYPH,
        description: "Draw a negative letter worth 4+ points.",
    },
    [SpellType.HIEROGLYPH]: {
        cost: 7,
        turn: false,
        type: SpellType.HIEROGLYPH,
        description: "Draw a negative blank tile.",
    },
    [SpellType.HONE]: {
        cost: 15,
        turn: false,
        type: SpellType.HONE,
        description: "Increases the chance of a tile being enchanted",
    },
    [SpellType.MANIFEST]: {
        cost: 10,
        turn: false,
        type: SpellType.MANIFEST,
        description: "10% 3W, 20% 3L, 30% 2W, 40% 2L.",
    },
    [SpellType.SWAP]: {
        cost: 5,
        turn: true,
        type: SpellType.SWAP,
        description: "Swap two tiles. Gain x.5 points for the word.",
    },
};
