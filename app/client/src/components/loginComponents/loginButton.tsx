"use client";
import { useRouter } from "next/navigation";

export default function LoginButton() {
    const Router = useRouter();

    const handleLogin = () => {
        console.log("Login button clicked");
        Router.replace('/home');
    }

    return (
        <button className="bg-blue-500 text-white rounded-md p-2" onClick={handleLogin}>Login</button>
    )


}
