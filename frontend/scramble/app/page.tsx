import CreateGameButton from "@/components/root/CreateGameButton";
import FindGameButton from "@/components/root/FindGameButton";
import { JoinGameForm } from "@/components/root/JoinGameForm";

import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8">welcome to my game</h1>

            <div className="flex space-x-4 mb-12">
                <CreateGameButton></CreateGameButton>
                <FindGameButton></FindGameButton>
            </div>

            {/* <h1 className="text-2xl font-semibold mb-6">Have a game code already?</h1> */}

            <div className="flex space-x-4">
                {/* <input
          type="text"
          placeholder="Enter game code"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-6 py-3 rounded-lg shadow-md">Join Game</button> */}
                <JoinGameForm></JoinGameForm>
            </div>
            <Link href={`test/${Math.random().toString().slice(2).substring(0, 5)}`}>test page</Link>
        </div>
    );
}
