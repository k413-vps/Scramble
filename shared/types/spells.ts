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
    CRYSTALBALL = "CrystalBall",
    SWAP = "Swap",
}

export const spells: Spell[] = [
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
        description: "Choose an empty square. Nobody can play on this square.",
    },
    {
        cost: 7,
        turn: false,
        type: SpellType.CURSE,
        description:
            "Choose an empty square. When something is played on this square, the letter played on it will have a base score of -5.",
    },
    {
        cost: 5,
        turn: false,
        type: SpellType.GRABBER,
        description: "Choose a player. Force them to lose all their tiles and redraw.",
    },
    {
        cost: 3,
        turn: false,
        type: SpellType.PICTOGRAPH,
        description: "Draw a random negative letter worth 1 - 3 points.",
    },
    {
        cost: 5,
        turn: false,
        type: SpellType.PETROGLYPH,
        description: "Draw a random negative letter worth 4+ points.",
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
        description: "Permanently increases the chance of a tile being enchanted when drawn.",
    },
    {
        cost: 10,
        turn: false,
        type: SpellType.MANIFEST,
        description: "Choose a non-enhanced empty square. 10% chance it's 3W, 20% 3L, 30% 2W, 40% 2L.",
    },
    {
        cost: 8,
        turn: true,
        type: SpellType.CRYSTALBALL,
        description: "Play twice this turn. The second play is worth half points.",
    },
    {
        cost: 5,
        turn: true,
        type: SpellType.SWAP,
        description:
            "Swap one of the tiles in your hand with a tile on the board. If it's a valid word, gain 0.5 points for the word.",
    },
];
