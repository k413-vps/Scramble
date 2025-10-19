import seedrandom from "seedrandom";
import { BoardTile, BoardTileType } from "../types/game";
import { Position } from "../types/tiles";

export function generateSeed(): number {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(array: T[], rng: seedrandom.PRNG): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function removePlannedFromBoard(board: Array<Array<BoardTile | null>>) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const tile = board[row][col];
            if (tile && tile.type === BoardTileType.PLANNED) {
                board[row][col] = null;
            }
        }
    }
}
