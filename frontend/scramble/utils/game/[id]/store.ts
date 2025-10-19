import { create } from "zustand";
import {
    ActionHistory,
    BoardTile,
    BoardTileType,
    ClientSideGame,
    ClientSidePlayer,
    DictionaryEnum,
    GameState,
    HistoryType,
} from "shared/types/game";
import { defaultPoints } from "shared/defaults/LetterPoints";
import { Position, Tile } from "shared/types/tiles";
import { PassAction, PlaceAction, SacrificeAction, ShuffleAction, WriteAction } from "shared/types/actions";
import { validPlay } from "./gameLogic";
import { removePlannedFromBoard } from "shared/functions/util";

export const useGameStore = create<
    ClientSideGame & {
        // setters
        init: (game: ClientSideGame) => void;
        addPlayer: (
            player: ClientSidePlayer,
            playerId: string,
            playerTurnOrder: string[],
            owner: boolean,
            bagSize?: number
        ) => void;
        startGame: (turnOrder: string[], hand: Tile[], tilesRemaining: number, timeOfLastTurn: number) => void;
        handToHand: (index1: number, index2: number) => void;
        handToBoard: (row: number, col: number, index: number, letter: string) => void;
        boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number, letter: string) => void;
        boardToHand: (fromRow: number, fromCol: number, index: number) => void;
        setPlayerId: (playerId: string) => void;
        drawTiles: (newHand: Tile[], bagSize: number) => void;
        setTimeOfLastTurn: (time: number) => void;
        setLastToDrawId: (lastToDrawId: string) => void;

        placeAction: (
            action: PlaceAction,
            bagSize: number,
            idToPoints: Record<string, number>,
            nextPlayerId: string
        ) => void;
        passAction: (action: PassAction, nextPlayerId: string) => void;
        shuffleAction: (action: ShuffleAction, bagSize: number, nextPlayerId: string) => void;
        writeAction: (action: WriteAction, nextPlayerId: string) => void;
        sacrificeAction: (action: SacrificeAction, nextPlayerId: string) => void;

        shuffleRecall: () => void;
        recallTiles: () => void;
        setPlannedTiles: (positions: Position[]) => void;

        gameOver: () => void;

        // getters
        getCurrentPlayer: () => ClientSidePlayer | null;
        getPlayer: () => ClientSidePlayer | null;
        getValidPlay: () => boolean;
        isCurrentPlayer: () => boolean;

        numRows: number;
        numCols: number;
        playerId: string; // the client player, (not the person whose turn it is)
    }
>((set, get) => ({
    players: {},
    playerTurnOrder: [],
    board: [],
    enhancements: [],
    currentPlayerId: "",
    hand: [],
    turnHistory: [],
    timePerTurn: 0,
    timeOfLastTurn: 0,
    dictionary: DictionaryEnum.twl06,
    wildMode: false,
    points: defaultPoints,
    enableEnchantments: false,
    enableSpecialActions: false,
    public: false,
    handSize: 0,
    seed: 0,
    randomSeed: false,
    purchasedSpells: [],
    tilesRemaining: 0,
    gameState: GameState.LOBBY,
    ownerId: "",
    lastToDrawId: "",

    startGame: (turnOrder: string[], hand: Tile[], tilesRemaining: number, timeOfLastTurn: number) => {
        set(() => ({
            gameState: GameState.IN_PROGRESS,
            playerTurnOrder: turnOrder,
            hand,
            currentPlayerId: turnOrder[0],
            tilesRemaining,
            timeOfLastTurn,
        }));
    },

    init: (game: ClientSideGame) => {
        set(() => ({
            ...game,
            numRows: game.board.length,
            numCols: game.board[0].length,
        }));
    },

    addPlayer: (
        player: ClientSidePlayer,
        playerId: string,
        playerTurnOrder: string[],
        owner: boolean,
        bagSize?: number
    ) => {
        set((state) => {
            const newPlayers = { ...state.players, [playerId]: player };
            console.log("bag size in store", bagSize);
            return {
                players: newPlayers,
                playerTurnOrder,
                ownerId: owner ? playerId : state.ownerId,
                tilesRemaining: bagSize,
            };
        });
    },

    // simple swap
    handToHand: (index1: number, index2: number) => {
        set((state) => {
            const newHand = [...state.hand];
            const temp = newHand[index1];
            newHand[index1] = newHand[index2];
            newHand[index2] = temp;
            return { hand: newHand };
        });
    },

    // can't place on occupied cell
    handToBoard: (row: number, col: number, index: number, letter: string) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            newBoard[row][col] = { type: BoardTileType.TILE, tile: { ...state.hand[index], letter } };
            const newHand = [...state.hand];
            newHand[index].position = { row, col };
            newHand[index].letter = letter;
            newBoard[row][col].tile!.position = { row, col };

            return { board: newBoard, hand: newHand };
        });
    },

    // can't place on occupied cell
    boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number, letter: string) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            newBoard[toRow][toCol] = fromTile;
            fromTile!.tile!.position = { row: toRow, col: toCol };
            (fromTile!.tile! as Tile).letter = letter;

            newBoard[fromRow][fromCol] = null;

            const newHand = [...state.hand];
            for (let i = 0; i < newHand.length; i++) {
                if (newHand[i].id == (fromTile!.tile as Tile).id) {
                    newHand[i].position = { row: toRow, col: toCol };
                    newHand[i].letter = letter;
                }
            }

            return { board: newBoard, hand: newHand };
        });
    },

    boardToHand: (fromRow: number, fromCol: number, index: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            const handTile = state.hand[index];
            const newHand = [...state.hand];

            if (handTile.position) {
                for (let i = 0; i < newHand.length; i++) {
                    if (newHand[i].id == (fromTile!.tile as Tile).id) {
                        newHand[i] = handTile;
                        break;
                    }
                }
                newHand[index] = fromTile!.tile as Tile;
                newHand[index].position = null;
                newHand[index].letter = (fromTile!.tile! as Tile).blank ? "_" : (fromTile!.tile! as Tile).letter;
                newBoard[fromRow][fromCol] = null;
            } else {
                for (let i = 0; i < newHand.length; i++) {
                    if (newHand[i].id == (fromTile!.tile as Tile).id) {
                        newHand.splice(i, 1);
                        break;
                    }
                }

                newHand.splice(index, 0, fromTile!.tile as Tile);
                newHand[index].position = null;
                newHand[index].letter = (fromTile!.tile! as Tile).blank ? "_" : (fromTile!.tile! as Tile).letter;
                newBoard[fromRow][fromCol] = null;
            }
            return { board: newBoard, hand: newHand };
        });
    },

    setPlayerId: (playerId: string) => {
        set(() => ({
            playerId,
        }));
    },

    drawTiles: (newHand: Tile[], bagSize: number) => {
        set(() => ({
            hand: newHand,
            tilesRemaining: bagSize,
        }));
    },

    setTimeOfLastTurn: (time: number) => {
        set(() => ({
            timeOfLastTurn: time,
        }));
    },

    setLastToDrawId: (lastToDrawId: string) => {
        set(() => ({
            lastToDrawId,
        }));
    },

    placeAction: (action: PlaceAction, bagSize: number, idToPoints: Record<string, number>, nextPlayerId: string) => {
        set((state) => {
            const placedTiles = action.hand;
            const newBoard = state.board.map((r) => r.slice());
            const players = { ...state.players };
            const newHand = [...state.hand];

            players[state.currentPlayerId].points += action.points;
            players[state.currentPlayerId].mana += action.mana;

            for (const placedTile of placedTiles) {
                placedTile.placed = true;
                const { row, col } = placedTile.position!;
                newBoard[row][col] = { type: BoardTileType.TILE, tile: placedTile };

                for (let i = 0; i < newHand.length; i++) {
                    if (
                        newHand[i].id !== placedTile.id &&
                        newHand[i].position?.row === row &&
                        newHand[i].position?.col === col
                    ) {
                        newHand[i].position = null;
                    }
                }
            }

            for (let row = 0; row < newBoard.length; row++) {
                for (let col = 0; col < newBoard[row].length; col++) {
                    const boardTile = newBoard[row][col];
                    if (boardTile && boardTile.type === BoardTileType.TILE && idToPoints[(boardTile.tile as Tile).id]) {
                        const assignedPoints = idToPoints[(boardTile.tile as Tile).id];
                        // (boardTile.tile as Tile).points = assignedPoints;
                        // console.log("Assigned points", assignedPoints, "to tile", (boardTile.tile as Tile).id);
                        const deepCopy = { ...(boardTile.tile as Tile) };
                        deepCopy.points = assignedPoints;

                        // needs to replace with a deep copy to trigger re-render
                        newBoard[row][col] = { type: BoardTileType.TILE, tile: deepCopy };
                    }
                }
            }

            const historyElement: ActionHistory = {
                type: HistoryType.ACTION,
                actionData: action,
            };

            const output = {
                board: newBoard,
                tilesRemaining: bagSize,
                currentPlayerId: nextPlayerId,
                turnHistory: [...state.turnHistory, historyElement],
                players,
                hand: newHand,
            };

            return output;
        });
    },

    passAction: (action: PassAction, nextPlayerId: string) => {
        set((state) => {
            const historyElement: ActionHistory = {
                type: HistoryType.ACTION,
                actionData: action,
            };

            return { currentPlayerId: nextPlayerId, turnHistory: [...state.turnHistory, historyElement] };
        });
    },
    shuffleAction: (action: ShuffleAction, bagSize: number, nextPlayerId: string) => {
        set((state) => {
            const historyElement: ActionHistory = {
                type: HistoryType.ACTION,
                actionData: action,
            };
            return {
                currentPlayerId: nextPlayerId,
                turnHistory: [...state.turnHistory, historyElement],
                tilesRemaining: bagSize,
            };
        });
    },
    writeAction: (action: WriteAction, nextPlayerId: string) => {
        set((state) => ({ currentPlayerId: nextPlayerId }));
    },
    sacrificeAction: (action: SacrificeAction, nextPlayerId: string) => {
        set((state) => {
            const players = { ...state.players };
            players[state.currentPlayerId].points += action.points;
            players[state.currentPlayerId].mana += action.mana;

            const historyElement: ActionHistory = {
                type: HistoryType.ACTION,
                actionData: action,
            };

            return { players, currentPlayerId: nextPlayerId, turnHistory: [...state.turnHistory, historyElement] };
        });
    },

    recallTiles: () => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const newHand = [...state.hand];
            for (const tile of newHand) {
                if (tile.position) {
                    const { row, col } = tile.position;
                    newBoard[row][col] = null;
                    tile.position = null;
                }
            }
            return { board: newBoard, hand: newHand };
        });
    },

    setPlannedTiles: (positions: Position[]) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const newHand = [...state.hand];

            removePlannedFromBoard(newBoard);
            const plannedBoardTile: BoardTile = {
                type: BoardTileType.PLANNED,
                tile: null,
            };

            for (const pos of positions) {
                for (const tile of newHand) {
                    if (tile.position && tile.position.row === pos.row && tile.position.col === pos.col) {
                        tile.position = null;
                    }
                }

                newBoard[pos.row][pos.col] = plannedBoardTile;
            }

            return { board: newBoard, hand: newHand };
        });
    },

    gameOver: () => {
        set(() => ({
            gameState: GameState.COMPLETED,
        }));
    },

    shuffleRecall: () => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            for (const tile of state.hand) {
                if (tile.position) {
                    const { row, col } = tile.position;
                    newBoard[row][col] = null;
                    tile.position = null;
                }
            }
            return { board: newBoard };
        });
    },

    // getters
    getPlayer: () => get().players[get().playerId],
    getCurrentPlayer: () => get().players[get().currentPlayerId],
    getValidPlay: () => {
        const { board, enhancements, dictionary } = get();
        return validPlay(board, enhancements, dictionary);
    },

    isCurrentPlayer: () => get().playerId === get().currentPlayerId,

    numRows: 15,
    numCols: 15,
    playerId: "",
}));
