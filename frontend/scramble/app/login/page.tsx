"use client";

import authClient from "@/lib/auth_client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Login() {
    const router = useRouter();
    const { data: user, isPending } = authClient.useSession();
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    useEffect(() => {
        if (!isPending) {
            if (user) {
                router.replace("/");
                return;
            }

            setLoading(false);
        }
    }, [isPending, user, router]);

    const handleGoogleLogin = async () => {
        let callbackURL;
        if (redirect) {
            callbackURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${redirect}`;
        } else {
            callbackURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
        }

        await authClient.signIn.social({
            provider: "google",
            callbackURL: callbackURL,
        });
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6 shadow-2xl">
                <CardContent className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold">Please sign in to continue</h1>
                    <h2 className="text-muted-foreground">thank you</h2>

                    <Button onClick={handleGoogleLogin} className="w-full" disabled={loading} variant="outline">
                        <LogIn className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <Login></Login>
        </Suspense>
    );
}
