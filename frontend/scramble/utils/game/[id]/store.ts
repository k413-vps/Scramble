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
            tilesRemaining
        }));
    },

    init: (game: ClientSideGame) => {
        set(() => ({
            ...game,
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
}));
