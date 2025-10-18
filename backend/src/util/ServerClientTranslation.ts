import { ClientSideGame, ServerSideGame, ServerSidePlayer, ClientSidePlayer } from "shared/types/game";

export function convertGame(game: ServerSideGame, userId: string): ClientSideGame {
    // const players = game.players.map(convertPlayer);
    const players = Object.fromEntries(Object.entries(game.players).map(([id, player]) => [id, convertPlayer(player)]));

    const ans: ClientSideGame = {
        players: players,
        board: game.board,
        enhancements: game.enhancements,
        currentPlayerId: game.currentPlayerId,
        hand: game.players[userId]?.hand || [],
        turnHistory: game.turnHistory,
        timePerTurn: game.timePerTurn,
        timeOfLastTurn: game.timeOfLastTurn,
        dictionary: game.dictionary,
        wildMode: game.wildMode,
        points: game.points,
        enableEnchantments: game.enableEnchantments,
        enableSpecialActions: game.enableSpecialActions,
        public: game.public,
        handSize: game.handSize,
        seed: game.seed,
        randomSeed: game.randomSeed,
        purchasedSpells: game.players[userId]?.purchasedSpells || [],
        tilesRemaining: game.bag.length,
        gameState: game.gameState,
        ownerId: game.ownerId,
        playerTurnOrder: game.playerTurnOrder,
        lastToDrawId: game.lastToDrawId,
    };

    return ans;
}

export function convertPlayer(player: ServerSidePlayer): ClientSidePlayer {
    const ans: ClientSidePlayer = {
        name: player.name,
        points: player.points,
        mana: player.mana,
        profilePicture: player.profilePicture,
    };

    return ans;
}
