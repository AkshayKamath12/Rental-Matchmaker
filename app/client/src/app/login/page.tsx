"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { setCookie} from 'cookies-next';


export default async function LoginPage() {
    const Router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = async () => {
        const userRefCurrent = usernameRef.current;
        const passwordRefCurrent = passwordRef.current;
        if (!userRefCurrent || !passwordRefCurrent) {
            console.error("Username or password reference is null");
            return;
        }

        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            { 
                usernameOrEmail: userRefCurrent.value, 
                password: passwordRefCurrent.value 
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            };
            response.text().then((text) => {
                console.log("Response data:", text); //logging jwt token
                setCookie('jwt-token', text, { maxAge: 60 * 60 * 24 * 7 }); // Set cookie for 7 days
                Router.replace('/');
            });        
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }


    return (
      <div className="flex flex-col w-[80%] mx-32 h-screen items-center justify-center">
        <header className="text-5xl mb-8">Login</header>
        <div className="flex flex-col items-center space-x-4">
            <input type="text" placeholder="Username or Email" ref={usernameRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="password" placeholder="Password" ref={passwordRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <button className="bg-blue-500 text-white rounded-md p-2" onClick={handleLogin}>Login</button>
            <button className="bg-blue-500 text-white rounded-md p-2 mt-4">Register</button>
        </div>
      </div>
    )
  }