import { actions, ActionType } from "shared/types/actions";
import ActionsEntry from "./ActionsEntry";
import ScorePill from "./ScorePill";
import { useGameStore } from "@/utils/game/[id]/store";
import { calculateScore } from "@/utils/game/[id]/gameLogic";
import { handlePlay, handlePass, handleShuffle, handleSacrifice } from "@/utils/game/[id]/HandleActions";
import { Socket } from "socket.io-client";

type ActionWindowContentProps = {
    socket: Socket;
};

export default function ActionWindowContent({ socket }: ActionWindowContentProps) {
    const playerId = useGameStore((state) => state.playerId);
    const currentPlayerId = useGameStore((state) => state.currentPlayerId);

    const hand = useGameStore((state) => state.hand);

    const isValidPlay = useGameStore((state) => state.getValidPlay());
    const isCurrentPlayer = playerId === currentPlayerId;

    const shuffleRecall = useGameStore((state) => state.shuffleRecall);


    // const mana = player!.mana;

    const board = useGameStore((state) => state.board);
    const enhancements = useGameStore((state) => state.enhancements);
    const dictionary = useGameStore((state) => state.dictionary);
    const { points, mana: manaGain, wordsFormed } = calculateScore(board, enhancements, dictionary);

    return (
        <div
            style={{
                padding: "16px",
                overflowY: "auto",
                height: "100%",
                backgroundColor: "#000000",
                color: "var(--color-card-foreground)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
            }}
        >
            <div>
                <ActionsEntry
                    action={actions[ActionType.PLAY]}
                    onClick={() => handlePlay(socket, hand, playerId, points, manaGain, wordsFormed)}
                    disabled={!isCurrentPlayer || !isValidPlay}
                >
                    {isValidPlay && <ScorePill points={points} mana={manaGain} />}
                </ActionsEntry>
                <ActionsEntry
                    action={actions[ActionType.PASS]}
                    onClick={() => handlePass(socket, playerId)}
                    disabled={!isCurrentPlayer}
                />
                <ActionsEntry
                    action={actions[ActionType.SHUFFLE]}
                    onClick={() => handleShuffle(socket, hand, playerId, shuffleRecall)}
                    disabled={!isCurrentPlayer}
                />
                {/* <ActionsEntry
                    action={actions[ActionType.WRITE]}
                    onClick={handleWrite}
                    disabled={mana < actions[ActionType.WRITE].cost || !isCurrentPlayer}
                /> */}
                <ActionsEntry
                    action={actions[ActionType.SACRIFICE]}
                    onClick={() => handleSacrifice(socket, playerId)}
                    disabled={!isCurrentPlayer}
                />
            </div>
        </div>
    );
}
