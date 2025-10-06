import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useGameStore } from "@/utils/game/[id]/store";
import { Socket } from "socket.io-client";
import { StartToServer } from "shared/types/SocketMessages";

type LobbyPageProps = {
    userId: string;
    socket: Socket;
};

export default function LobbyPage({ userId, socket }: LobbyPageProps) {
    const gameState = useGameStore();

    function getLength(num: number): string {
        if (num == 50) {
            return "short";
        }
        if (num == 100) {
            return "medium";
        }
        if (num == 200) {
            return "long";
        }

        return "custom";
    }

    function handleStartButton() {
        const msg: StartToServer = {};
        socket.emit("start_game", msg);
    }

    return (
        <div className="p-6 grid gap-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">Game Lobby</h1>

            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-2">Players</h2>
                    <ul className="space-y-2">
                        {Object.entries(gameState.players).map(([id, player]) => (
                            <li key={id} className="flex justify-between">
                                <span>{player.name}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 grid gap-2">
                    <h2 className="text-xl font-semibold mb-2">Game Settings</h2>
                    <h3>Game Length: {getLength(gameState.tilesRemaining)}</h3>
                    <h3>Hand Size: {gameState.handSize}</h3>
                    <h3>Dictionary: {gameState.dictionary}</h3>
                    <h3>Time per Turn: {gameState.timePerTurn === 0 ? "Unlimited" : `${gameState.timePerTurn}s`}</h3>
                    <h3>Public Game: {gameState.public ? "Yes" : "No"}</h3>
                    <h3>Wild Mode: {gameState.wildMode ? "On" : "Off"}</h3>
                    <h3>Enchantments: {gameState.enableEnchantments ? "Enabled" : "Disabled"}</h3>
                    <h3>Special Actions: {gameState.enableSpecialActions ? "Enabled" : "Disabled"}</h3>
                    <h3>Random Seed: {gameState.randomSeed ? "Yes" : "No"}</h3>
                    <h3>Seed: {gameState.seed}</h3>
                    <h3>Status: {gameState.gameStarted ? "In Progress" : "Waiting to Start"}</h3>
                </CardContent>
            </Card>

            {gameState.ownerId == userId && <Button onClick={handleStartButton}>Start Game</Button>}
        </div>
    );
}
