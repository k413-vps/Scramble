import { useGameStore } from "@/utils/game/[id]/store";
import { ActionType, PlaceAction } from "shared/types/actions";
import { ActionHistory, HistoryType } from "shared/types/game";
import { getMessageAction } from "@/utils/game/[id]/History";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CompletedPage() {
    const turnHistory = useGameStore((state) => state.turnHistory);
    const players = useGameStore((state) => state.players);

    const actionsOnly = turnHistory.filter((entry) => entry.type === HistoryType.ACTION) as ActionHistory[];

    // descending order
    const playsOnly = (
        actionsOnly
            .filter((entry) => entry.actionData.type === ActionType.PLAY)
            .map((entry) => entry.actionData) as PlaceAction[]
    ).sort((a, b) => b.points - a.points);

    const longestWordPlay = playsOnly.length
        ? playsOnly.reduce((longest, current) => {
              const longestWordInCurrent = current.wordsFormed.reduce(
                  (longestWord, word) => (word.length > longestWord.length ? word : longestWord),
                  ""
              );

              const longestWordInLongest = longest.wordsFormed.reduce(
                  (longestWord, word) => (word.length > longestWord.length ? word : longestWord),
                  ""
              );

              return longestWordInCurrent.length > longestWordInLongest.length ? current : longest;
          }, playsOnly[0])
        : null;

    const mostPointsPlay = playsOnly.length ? playsOnly[0] : null;

    const leastPointsPlay = playsOnly.length ? playsOnly[playsOnly.length - 1] : null;

    const leaderboard = Object.entries(players)
        .map(([id, player]) => ({
            id,
            name: player.name,
            points: player.points,
            profilePicture: player.profilePicture,
        }))
        .sort((a, b) => b.points - a.points);

    return (
        <div className="p-8 text-gray-800 dark:text-gray-200 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-white">Game Over</h1>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-white">Leaderboard</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-white">Rank</TableHead>
                                <TableHead className="text-white">Player</TableHead>
                                <TableHead className="text-white">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((player, index) => (
                                <TableRow key={player.id}>
                                    <TableCell className="text-center text-white">{index + 1}</TableCell>
                                    <TableCell className="flex items-center gap-4 text-white">
                                        <img
                                            src={player.profilePicture}
                                            alt={`${player.name}'s profile`}
                                            className="w-10 h-10 rounded-full border border-gray-800"
                                        />
                                        <span>{player.name}</span>
                                    </TableCell>
                                    <TableCell className="text-center text-white">{player.points}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">Highlights</h2>
                <div className="space-y-4">
                    {longestWordPlay ? (
                        <p className="text-lg text-white">
                            <strong>Longest Word:</strong>{" "}
                            <span className="font-mono text-blue-400">
                                {`${longestWordPlay.wordsFormed.reduce((longest, word) =>
                                    word.length > longest.length ? word : longest
                                )} by ${players[longestWordPlay.playerId].name}`}
                            </span>
                        </p>
                    ) : (
                        <p className="text-lg text-white">No words were played during the game.</p>
                    )}
                    {mostPointsPlay && (
                        <p className="text-lg text-white">
                            <strong>Most Points in a Turn:</strong>{" "}
                            <span className="font-mono text-green-400">
                                {getMessageAction(mostPointsPlay, players)}
                            </span>
                        </p>
                    ) }
                    {leastPointsPlay && (
                        <p className="text-lg text-white">
                            <strong>Least Points in a Turn:</strong>{" "}
                            <span className="font-mono text-red-400">{getMessageAction(leastPointsPlay, players)}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
