import { create } from "zustand";
import { BoardTileType, ClientSideGame, ClientSidePlayer, DictionaryEnum } from "shared/types/game";
import { defaultPoints } from "shared/defaults/LetterPoints";
import { Tile } from "shared/types/tiles";

export const useGameStore = create<
    ClientSideGame & {
        // setters
        init: (game: ClientSideGame) => void;
        addPlayer: (player: ClientSidePlayer) => void;
        setOwner: (playerId: string) => void;
        startGame: (players: ClientSidePlayer[], hand: Tile[], tilesRemaining: number) => void;
        handToHand: (index1: number, index2: number) => void;
        handToBoard: (row: number, col: number, index: number) => void;
        boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
        boardToHand: (fromRow: number, fromCol: number, index: number) => void;
        setPlayerId: (playerId: string) => void;

        // getters
        getCurrentPlayer: () => ClientSidePlayer | null;
        getPlayer: () => ClientSidePlayer | null;

        numRows: number;
        numCols: number;
        playerId: string; // the client player, (not the person whose turn it is)
    }
>((set, get) => ({
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
    handToBoard: (row: number, col: number, index: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            newBoard[row][col] = { type: BoardTileType.TILE, tile: state.hand[index] };
            const newHand = [...state.hand];
            newHand[index].position = { row, col };

            return { board: newBoard, hand: newHand };
        });
    },

    // can't place on occupied cell
    boardToBoard: (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            newBoard[toRow][toCol] = fromTile;
            fromTile!.tile.position = { row: toRow, col: toCol };

            newBoard[fromRow][fromCol] = null;

            return { board: newBoard };
        });
    },

    boardToHand: (fromRow: number, fromCol: number, index: number) => {
        set((state) => {
            const newBoard = state.board.map((r) => r.slice());
            const fromTile = newBoard[fromRow][fromCol];
            const handTile = state.hand[index];
            const newHand = [...state.hand];

            console.log(handTile, "hand tile");
            console.log(fromTile, "from tile");

            if (handTile.position) {
                for (let i = 0; i < newHand.length; i++) {
                    if (newHand[i].id == (fromTile!.tile as Tile).id) {
                        newHand[i] = handTile;
                        break;
                    }
                }
                newHand[index] = fromTile!.tile as Tile;
                newHand[index].position = null;
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

    // getters
    getPlayer: () => get().players.find((p) => p.id === get().playerId) || null,
    getCurrentPlayer: () => get().players.find((p) => p.id === get().currentPlayerId) || null,

    numRows: 15,
    numCols: 15,
    playerId: "",
}));
