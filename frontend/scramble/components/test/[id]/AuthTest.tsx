"use client";

import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth_client";
import Image from "next/image";
import { ParamValue } from "next/dist/server/request/params";
import { BetterFetchError } from "better-auth/react";

type AuthProps = {
    roomId: ParamValue;
    name: string | undefined;
    profileUrl: string | undefined | null;
    sessionError: BetterFetchError | null;
    isPending: boolean;
};

export default function Auth({ roomId, name, profileUrl, isPending }: AuthProps) {
    async function handleSignIn() {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/test/${roomId}`,
        });
    }

    async function handleSignOut() {
        await authClient.signOut();
    }

    function renderInfo() {
        if (isPending) {
            return <h1>Loading Profile info</h1>;
        }

        if (name) {
            return (
                <div>
                    <h1>Welcome {name}!</h1>
                    <Image src={profileUrl!} alt="this u?" width={125} height={75} />
                </div>
            );
        }

        return <h1>u are not signed in :/ </h1>;
    }

    return (
        <div>
            <Button onClick={handleSignIn}>Sign in</Button>

            <Button onClick={handleSignOut}>Sign out</Button>

            {renderInfo()}
        </div>
    );
}
