"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const Router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const getJWT = async () => {
    const userRefCurrent = usernameRef.current;
    const passwordRefCurrent = passwordRef.current;
    
    return fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernameOrEmail: userRefCurrent!.value,
        password: passwordRefCurrent!.value,
      }),
    }).then((res) => {
      if(!res.ok){
        setError(true);
      }
      return res.text();
    });
  };


  async function handleLogin() {
    console.log("logging in");
    const result = await getJWT();
    if (result) {
      setCookie("jwt-token", result, { maxAge: 60 * 60 }); 
      getProfile().then((res) => {
        const fetchProfile = async () => {
          try {
            await res.json();
            Router.replace("/");
          } catch (error) {
            console.log("profile not set");
            Router.replace("/profile");
          }
        };
        fetchProfile();
      });

      Router.replace("/");
    } else {
      console.error("Login failed");
    }
  }

  async function handleRegister() {
    Router.replace("/register");
  }

  const getProfile = async () => {
    return fetch("http://localhost:8080/api/profile", {
      credentials: "include",
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="text-5xl font-bold text-purple-700 mb-8">
        Welcome Back!
      </header>

      {/* Login Form */}
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Login</h2>
        <input
          type="text"
          placeholder="Username or Email"
          ref={usernameRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 mb-4"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg hover:from-pink-600 hover:to-red-600"
        >
          Register
        </button>
        {
          error && <div className="mt-4">
            <p className="text-xl text-red-600 bold">Login failed</p>
          </div>
        }
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        Rental Matchmaker © 2025
      </footer>
    </div>
  );
}