import { create } from "zustand";
import { ClientSideGame, ClientSidePlayer, DictionaryEnum } from "shared/types/game";
import { defaultPoints } from "shared/defaults/LetterPoints";
import { Tile } from "shared/types/tiles";

export const useGameStore = create<
    ClientSideGame & {
        init: (game: ClientSideGame) => void;
        addPlayer: (player: ClientSidePlayer) => void;
        setOwner: (playerId: string) => void;
        startGame: (players: ClientSidePlayer[], hand: Tile[], tilesRemaining: number) => void;
        handToHand: (index1: number, index2: number) => void;
        handToBoard: (row: number, col: number, index: number) => void;
        boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
        boardToHand: (fromRow: number, fromCol: number, index: number) => void;
        numRows: number;
        numCols: number;
    }
>((set) => ({
    players: [],
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
    gameStarted: false,
    ownerId: "",

    startGame: (players: ClientSidePlayer[], hand: Tile[], tilesRemaining: number) => {
        set(() => ({
            gameStarted: true,
            players,
            hand,
            currentPlayerId: players[0].id,
            tilesRemaining,
        }));
    },

    init: (game: ClientSideGame) => {
        set(() => ({
            ...game,
            numRows: game.board.length,
            numCols: game.board[0].length,
        }));
    },

    addPlayer: (player: ClientSidePlayer) => {
        set((state) => ({
            players: [...state.players, player],
        }));
    },

    setOwner: (playerId: string) => {
        set(() => ({
            ownerId: playerId,
        }));
    },
    handToHand: (index1: number, index2: number) => {
        set((state) => {
            const newHand = [...state.hand];
            const temp = newHand[index1];
            newHand[index1] = newHand[index2];
            newHand[index2] = temp;
            return { hand: newHand };
        });
    },

    handToBoard: (row: number, col: number, index: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            newBoard[row][col] = { type: "tile", tile: state.hand[index] };
            const newHand = [...state.hand];
            newHand[index].position = { row, col };

            return { board: newBoard, hand: newHand };
        });
    },

    boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            const toTile = newBoard[toRow][toCol];
            newBoard[toRow][toCol] = fromTile;
            fromTile!.tile.position = { row: toRow, col: toCol };

            if (toTile !== null && toTile.type === "tile") {
                newBoard[fromRow][fromCol] = toTile;
                toTile.tile.position = { row: fromRow, col: fromCol };
            } else {
                newBoard[fromRow][fromCol] = null;
            }
            return { board: newBoard };
        });
    },

    boardToHand: (fromRow: number, fromCol: number, index: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            const handTile = state.hand[index];
            const newHand = [...state.hand];

            // // dropped to empty slot
            // if (handTile.position) {
            //     newHand[index] = fromTile!.tile as Tile;
            //     newHand[index].position = null;
            //     newBoard[fromRow][fromCol] = null;
            // }
            // // dropped into existing hand tile
            // else {
                for (let i = 0; i < newHand.length; i++) {
                    if (newHand[i].id == (fromTile!.tile as Tile).id) {
                        newHand.splice(i, 1);
                        break;
                    }
                }

                newHand.splice(index, 0, fromTile!.tile as Tile);
                newHand[index].position = null;
                newBoard[fromRow][fromCol] = null;
            // }
            return { board: newBoard, hand: newHand };
        });
    },

    numRows: 15,
    numCols: 15,
}));
