import { BoardTile, BoardTileType, Dictionary, DictionaryEnum, Enhancement } from "shared/types/game";
import { Tile } from "shared/types/tiles";
import { getDictionary } from "shared/defaults/wordlists/dictionaries";

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
            if (
                !cell ||
                cell.type !== BoardTileType.TILE
            ) {
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
            if (
                !cell ||
                cell.type !== BoardTileType.TILE 
            ) {
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

export function validPlay(
    board: Array<Array<BoardTile | null>>,
    enhancements: Enhancement[][],
    dictionaryEnum: DictionaryEnum
): boolean {
    const planned = plannedTiles(board);

    if (!validPlacement(board, planned, enhancements)) {
        return false;
    }

    const wordTiles = newWords(board, planned);

    const dict = getDictionary(dictionaryEnum);

    const words = wordTiles.map((tiles) =>
        tiles
            .map((t) => t.letter)
            .join("")
            .toLowerCase()
    );

    console.log("all words", words);
    for (const word of words) {
        if (!dict.has(word)) {
            console.log("invalid word", word);
            return false;
        }
    }

    return true;
}
