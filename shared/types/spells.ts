export interface Spell {
    cost: number;
    turn: boolean; // does it need to be your turn when you cast this spell?
    type: string;
}

export interface PaintBrush extends Spell {
    cost: 12;
    turn: false;
    type: "PaintBrush";
}

export interface Block extends Spell {
    cost: 10;
    turn: false;
    type: "Block";
}

export interface Curse extends Spell {
    cost: 7;
    turn: false;
    type: "Curse";
}

export interface Grabber extends Spell {
    cost: 5;
    turn: false;
    type: "Grabber";
}

export interface Pictograph extends Spell {
    cost: 3;
    turn: false;
    type: "Pictograph";
}

export interface Petroglyph extends Spell {
    cost: 5;
    turn: false;
    type: "Petroglyph";
}

export interface Hieroglyph extends Spell {
    cost: 7;
    turn: false;
    type: "Hieroglyph";
}

export interface Hone extends Spell {
    cost: 15;
    turn: false;
    type: "Hone";
}

export interface Manifest extends Spell {
    cost: 10;
    turn: true;
    type: "Manifest";
}

export interface CrystalBall extends Spell {
    cost: 8;
    turn: true;
    type: "CrystalBall";
}

export interface Swap extends Spell {
    cost: 5;
    turn: true;
    type: "Swap";
}

/**
 * Idea for spells.
 * paint brush: permanent hand size + 1
 *
 * block: choose an empty square. nobody can play on this square. When its your turn, you have to play on the block. only one block per person at a time
 *
 * curse: choose an empty square. when something is played on this square, the letter played on it is set to have points = -5.
 * Players don't know which square is cursed until you play on it (except for the player who played it)
 *
 * grabber: choose a player. force them to lose all their tiles and redraw
 *
 * pictograph: draw an extra random letter worth 1 - 3 points
 *
 * petroglyph: draw an extra random letter worth 4+ points
 *
 * hieroglyph: draw an extra blank
 *
 * hone: increases the chance of a tile being enchanted when drawn
 *
 * manifest: choose a non enhanced empty square. 10% chance its 3W, 20% 3L, 30% 2W, 40% 2L
 *
 * crystall ball: play twice. second play is worth half points.
 *
 * swap: swap one of the tiles in your hand with a tile on the board if its a valid word. gain .5 points for the word.
 */
