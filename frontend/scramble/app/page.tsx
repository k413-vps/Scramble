"use client"

import CreateGameButton from "@/components/page/CreateGameButton";
import FindGameButton from "@/components/page/FindGameButton";
import { JoinGameForm } from "@/components/page/JoinGameForm";
import { useUser } from "@auth0/nextjs-auth0";

import Image from "next/image";

export default function Home() {
    const { user, isLoading } = useUser();

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
            <div className="flex space-x-4">
                <a href="/auth/login">Login</a>
                <a href="/auth/logout">Logout</a>
            </div>

            <>
                {isLoading && <p>Loading...</p>}
                {user && (
                    <div style={{ textAlign: "center" }}>
                        <img
                            src={user.picture}
                            alt="Profile"
                            style={{ borderRadius: "50%", width: "80px", height: "80px" }}
                        />
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                    </div>
                )}
            </>
        </div>
    );
}
