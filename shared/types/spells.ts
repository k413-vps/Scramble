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

export const spellList: Spell[] = [
    {
        cost: 12,
        turn: false,
        type: SpellType.PAINTBRUSH,
        description: "Permanently increases your hand size by 1.",
    },
    {
        cost: 10,
        turn: false,
        type: SpellType.BLOCK,
        description: "Block a square from being played.",
    },
    {
        cost: 7,
        turn: false,
        type: SpellType.CURSE,
        description: "Square will have a base score of -5.",
    },
    {
        cost: 5,
        turn: false,
        type: SpellType.GRABBER,
        description: "Force a player to lose all their tiles and redraw.",
    },
    {
        cost: 3,
        turn: false,
        type: SpellType.PICTOGRAPH,
        description: "Draw a negative letter worth 1 - 3 points.",
    },
    {
        cost: 5,
        turn: false,
        type: SpellType.PETROGLYPH,
        description: "Draw a negative letter worth 4+ points.",
    },
    {
        cost: 7,
        turn: false,
        type: SpellType.HIEROGLYPH,
        description: "Draw a negative blank tile.",
    },
    {
        cost: 15,
        turn: false,
        type: SpellType.HONE,
        description: "Increases the chance of a tile being enchanted",
    },
    {
        cost: 10,
        turn: false,
        type: SpellType.MANIFEST,
        description: "10% 3W, 20% 3L, 30% 2W, 40% 2L.",
    },
    {
        cost: 5,
        turn: true,
        type: SpellType.SWAP,
        description: "Swap two tiles. Gain x.5 points for the word.",
    },
];
