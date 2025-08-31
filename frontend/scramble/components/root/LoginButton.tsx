import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginButton() {
    return (
        <div>
            <Button>
                <Link href="/login">Login</Link>
            </Button>
        </div>
    );
}
