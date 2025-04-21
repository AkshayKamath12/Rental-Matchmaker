"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { setCookie} from 'cookies-next';
import { useQuery } from "@tanstack/react-query";



export default function RegisterPage() {
    
    const Router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);


    
    async function handleRegister(){
        const userRefCurrent = usernameRef.current;
        const passwordRefCurrent = passwordRef.current;
        const passwordConfirmRefCurrent = confirmPasswordRef.current;
        const emailRefCurrent = emailRef.current;
        const nameRefCurrent = nameRef.current
        return fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            { 
                username: userRefCurrent!.value, 
                password: passwordRefCurrent!.value,
                email: emailRefCurrent!.value,
                name: nameRefCurrent!.value 
            }),
        }).then(res => {
            if(res.ok){
                Router.replace("/login");
            }
        });
    }


    return (
      <div className="flex flex-col w-[80%] mx-32 h-screen items-center justify-center">
        <header className="text-5xl mb-8">Register</header>
        <div className="flex flex-col items-center space-x-4">
            <input type="text" placeholder="Username" ref={usernameRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="password" placeholder="Password" ref={passwordRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="password" placeholder="Confirm Password" ref={confirmPasswordRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="text" placeholder="Email" ref={emailRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="text" placeholder="Name" ref={nameRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <button onClick={handleRegister} className="bg-blue-500 text-white rounded-md p-2 mt-4">Create Account</button>
        </div>
      </div>
    )
  }