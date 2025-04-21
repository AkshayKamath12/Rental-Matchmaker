"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { setCookie} from 'cookies-next';
import { useQuery } from "@tanstack/react-query";



export default function LoginPage() {
    
    const Router = useRouter();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    const getJWT = async () => {
        const userRefCurrent = usernameRef.current;
        const passwordRefCurrent = passwordRef.current;
        return fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
            { 
                usernameOrEmail: userRefCurrent!.value, 
                password: passwordRefCurrent!.value 
            }),
        }).then(res => res.text());
    }

    const { refetch } = useQuery({
        queryKey: ['login'],
        queryFn: getJWT,
        enabled: false, 
      })
    
    async function handleLogin(){
      console.log("logging in");
        const result = await refetch()
        if (result.isSuccess) {
            setCookie('jwt-token', result.data, { maxAge: 60 * 60 * 24 * 7 }); // Set cookie for 7 days
            getProfile().then((res)=>{
              const fetchProfile = async () => {
                try {
                  await res.json();
                  Router.replace("/")
                } catch (error) {
                  console.log("profile not set");
                  Router.replace("/profile");
                }
              };
              fetchProfile();
            });
            
            Router.replace('/');
        } else {
          console.error('Login failed')
        }
      }

      async function handleRegister(){
        Router.replace("/register");
      }

      

      const getProfile = async () =>{
        return fetch("http://localhost:8080/api/profile", {
          credentials:"include"
        })
      }


    return (
      <div className="flex flex-col w-[80%] mx-32 h-screen items-center justify-center">
        <header className="text-5xl mb-8">Login</header>
        <div className="flex flex-col items-center space-x-4">
            <input type="text" placeholder="Username or Email" ref={usernameRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="password" placeholder="Password" ref={passwordRef} className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <button onClick={handleLogin} className="bg-blue-500 text-white rounded-md p-2">Login</button>
            <button onClick = {handleRegister} className="bg-blue-500 text-white rounded-md p-2 mt-4">Register</button>
        </div>
      </div>
    )
  }