import { BoardTile, BoardTileType, Dictionary, DictionaryEnum, Enhancement } from "shared/types/game";
import { Enchantment, Tile } from "shared/types/tiles";
import { getDictionary } from "shared/defaults/wordlists/dictionaries";
import { Score } from "./HelperTypes";

// get all the tiles that are not placed yet
function plannedTiles(board: Array<Array<BoardTile | null>>): Tile[] {
    const ans: Tile[] = [];

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            const tile = board[r][c];
            if (tile && tile.type === BoardTileType.TILE && !(tile.tile as Tile).placed) {
                ans.push(tile.tile as Tile);
            }
        }
    }

    return ans;
}

// find the word in a given direction starting from (row, col)
function findWord(
    row: number,
    col: number,
    rowDir: number,
    colDir: number,
    board: Array<Array<BoardTile | null>>
): Tile[] {
    const word: Tile[] = [];
    let r = row;
    let c = col;

    // Move backward to find the start of the word
    while (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
        const tile = board[r][c];
        if (tile && tile.type === BoardTileType.TILE) {
            r -= rowDir;
            c -= colDir;
        } else {
            break;
        }
    }

    // Move forward to collect the word
    r += rowDir;
    c += colDir;
    while (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
        const tile = board[r][c];
        if (tile && tile.type === BoardTileType.TILE) {
            word.push(tile.tile as Tile);
            r += rowDir;
            c += colDir;
        } else {
            break;
        }
    }

    return word;
}

// get all new words formed by the planned tiles
function newWords(board: Array<Array<BoardTile | null>>, planned: Tile[]): Tile[][] {
    const newWords: Tile[][] = [];

    for (const tile of planned) {
        const { row, col } = tile.position!;

        // Check horizontal word
        const horizontalWord = findWord(row, col, 0, 1, board);
        if (horizontalWord.length > 1) {
            newWords.push(horizontalWord);
        }

        // Check vertical word
        const verticalWord = findWord(row, col, 1, 0, board);
        if (verticalWord.length > 1) {
            newWords.push(verticalWord);
        }
    }

    const uniqueWords: Tile[][] = [];
    const seen = new Set<string>();
    for (const word of newWords) {
        const wordKey = word.map((t) => t.letter).join("");
        if (!seen.has(wordKey)) {
            seen.add(wordKey);
            uniqueWords.push(word);
        }
    }

    return uniqueWords;
}

// get neighbors of a cell
function getNeighbors(row: number, col: number, board: Array<Array<BoardTile | null>>): Array<BoardTile | null> {
    const neighbors: Array<BoardTile | null> = [];
    const directions = [
        [-1, 0], // up
        [1, 0], // down
        [0, -1], // left
        [0, 1], // right
    ];

    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
            neighbors.push(board[nr][nc]);
        }
    }

    return neighbors;
}

// check if the planned tiles are in valid positions
function validPlacement(
    board: Array<Array<BoardTile | null>>,
    planned: Tile[],
    enhancements: Enhancement[][]
): boolean {
    if (planned.length === 0) return false;
    const rows = planned.map((tile) => tile.position!.row);
    const cols = planned.map((tile) => tile.position!.col);

    const allSameRow = rows.every((r) => r === rows[0]);
    const allSameCol = cols.every((c) => c === cols[0]);

    if (!allSameRow && !allSameCol) {
        console.log("not all in same row or column");
        return false;
    }

    // Sort positions for adjacency check
    const positions = planned
        .map((tile) => tile.position!)
        .sort(allSameRow ? (a, b) => a.col - b.col : (a, b) => a.row - b.row);

    // Check adjacency
    if (allSameRow) {
        const row = rows[0];
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);
        for (let c = minCol; c <= maxCol; c++) {
            const cell = board[row][c];
            if (!cell || cell.type !== BoardTileType.TILE) {
                console.log("gap in horizontal placement");
                return false;
            }
        }
    } else if (allSameCol) {
        const col = cols[0];
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        for (let r = minRow; r <= maxRow; r++) {
            const cell = board[r][col];
            if (!cell || cell.type !== BoardTileType.TILE) {
                console.log("gap in vertical placement");
                return false;
            }
        }
    }

    for (const tile of planned) {
        const pos = tile.position;
        if (enhancements[pos!.row][pos!.col] === Enhancement.START) {
            return true;
        }
    }

    const allNeighbors = planned.map((tile) => getNeighbors(tile.position!.row, tile.position!.col, board)).flat();

    for (const neighbor of allNeighbors) {
        if (neighbor && neighbor.type === BoardTileType.TILE && (neighbor.tile as Tile).placed) {
            return true;
        }
    }

    console.log("no adjacent tiles");
    return false;
}

function wordsFormed(board: Array<Array<BoardTile | null>>, planned: Tile[]): string[] {
    const wordTiles = newWords(board, planned);
    const words = wordTiles.map((tiles) =>
        tiles
            .map((t) => t.letter)
            .join("")
            .toLowerCase()
    );

    return words;
}

export function validPlay(
    board: Array<Array<BoardTile | null>>,
    enhancements: Enhancement[][],
    dictionaryEnum: DictionaryEnum
): boolean {
    const planned = plannedTiles(board);

    if (!validPlacement(board, planned, enhancements)) {
        return false;
    }

    const dict = getDictionary(dictionaryEnum);

    const words = wordsFormed(board, planned);

    for (const word of words) {
        if (!dict.has(word)) {
            console.log("invalid word", word);
            return false;
        }
    }

    return true;
}

function countWordsForTile(tile: Tile, board: Array<Array<BoardTile | null>>): number {
    if (!tile.position) return 0;
    const { row, col } = tile.position;

    let count = 0;

    // Check horizontal word
    const horizontalWord = findWord(row, col, 0, 1, board);
    if (horizontalWord.length > 1) count++;

    // Check vertical word
    const verticalWord = findWord(row, col, 1, 0, board);
    if (verticalWord.length > 1) count++;

    return count;
}

export function calculateScore(
    board: Array<Array<BoardTile | null>>,
    enhancements: Enhancement[][],
    dictionaryEnum: DictionaryEnum
): Score {
    if (!validPlay(board, enhancements, dictionaryEnum)) {
        return { points: -1, mana: -1, wordsFormed: [] };
    }

    // Get all planned tiles (not finalized)
    const planned = plannedTiles(board);

    // Get all new words formed by the planned tiles
    const words = newWords(board, planned);

    let totalPoints = 0;
    let totalMana = 0;
    let idToPoints: { [id: string]: number } = {};

    for (const word of words) {
        let wordMultiplier = 1;
        let tempIdToPoints: { [id: string]: number } = {};

        for (const tile of word) {
            const { row, col } = tile.position!;
            let letterMultiplier = 1;
            let tilePoints = tile.points;

            // Apply tile enchantments if new tile
            if (!tile.placed) {
                switch (tile.enchantment) {
                    case Enchantment.FOIL:
                        tilePoints += 7;
                        break;
                    case Enchantment.HOLOGRAPHIC:
                        tilePoints += 5 * countWordsForTile(tile, board);
                        break;
                    case Enchantment.POLYCHROME:
                        wordMultiplier *= 2;
                        break;
                    case Enchantment.NEGATIVE:
                        // No effect on score
                        break;
                    case Enchantment.BASE:
                    default:
                        break;
                }
            }
            // Apply board enhancements if new tile
            if (!tile.placed) {
                switch (enhancements[row][col]) {
                    case Enhancement.DOUBLE_LETTER:
                        letterMultiplier *= 2;
                        break;
                    case Enhancement.TRIPLE_LETTER:
                        letterMultiplier *= 3;
                        break;
                    case Enhancement.DOUBLE_WORD:
                        wordMultiplier *= 2;
                        break;
                    case Enhancement.TRIPLE_WORD:
                        wordMultiplier *= 3;
                        break;
                    case Enhancement.MANA:
                        totalMana += 3;
                        break;
                    case Enhancement.DOUBLE_START:
                        wordMultiplier *= 2;
                        break;
                    default:
                        break;
                }
            }

            tilePoints *= letterMultiplier;
            tempIdToPoints[tile.id] = tilePoints;
        }

        let entries = Object.entries(tempIdToPoints);
        for (let i = 0; i < entries.length; i++) {
            let [id, points] = entries[i];

            points = Math.ceil(points * wordMultiplier);
            idToPoints[id] = Math.max(idToPoints[id] || 0, points);
        }
    }

    for (const word of words) {
        const wordStr = word.map((t) => t.letter).join("");
        const wordScore = word.reduce((sum, tile) => sum + idToPoints[tile.id], 0);
        console.log("word score", word, wordScore);
        totalPoints += wordScore;
    }

    return {
        points: totalPoints,
        mana: totalMana,
        wordsFormed: wordsFormed(board, planned),
    };
}
