// Example Next.js page to display the entire game store with ShadCN UI
"use client";

import { useGameStore } from "@/utils/game/[id]/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function GamePage() {
    const store = useGameStore();

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Game Store Debug</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Badge variant="secondary">Game Started</Badge>: {store.gameStarted ? "Yes" : "No"}
                        </div>
                        <div>
                            <Badge variant="secondary">Owner ID</Badge>:{" "}
                            {store.ownerId || <span className="text-muted-foreground">None</span>}
                        </div>
                        <div>
                            <Badge variant="secondary">Current Player</Badge>:{" "}
                            {store.currentPlayerId || <span className="text-muted-foreground">None</span>}
                        </div>
                        <Separator />
                        <div>
                            <Badge>Players</Badge>
                            <ul className="list-disc ml-6 mt-2">
                                {store.players.map((player) => (
                                    <li key={player.id}>
                                        <span className="font-medium">{player.name}</span> ({player.id})
                                    </li>
                                ))}
                                {store.players.length === 0 && <li className="text-muted-foreground">No players</li>}
                            </ul>
                        </div>
                        <Separator />
                        <div>
                            <Badge>Hand</Badge>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {store.hand.map((tile, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-muted rounded text-sm">
                                        {tile.letter}
                                    </span>
                                ))}
                                {store.hand.length === 0 && <span className="text-muted-foreground">Empty</span>}
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <Badge>Other State</Badge>
                            <pre className="bg-muted p-2 rounded text-xs">
                                {JSON.stringify(
                                    {
                                        turnHistory: store.turnHistory,
                                        timePerTurn: store.timePerTurn,
                                        timeOfLastTurn: store.timeOfLastTurn,
                                        dictionary: store.dictionary,
                                        wildMode: store.wildMode,
                                        points: store.points,
                                        enableEnchantments: store.enableEnchantments,
                                        enableSpecialActions: store.enableSpecialActions,
                                        public: store.public,
                                        handSize: store.handSize,
                                        seed: store.seed,
                                        randomSeed: store.randomSeed,
                                        purchasedSpells: store.purchasedSpells,
                                        tilesRemaining: store.tilesRemaining,
                                    },
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
