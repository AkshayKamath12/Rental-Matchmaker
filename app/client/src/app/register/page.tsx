"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function RegisterPage() {
  const Router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleRegister() {
    const userRefCurrent = usernameRef.current;
    const passwordRefCurrent = passwordRef.current;
    const passwordConfirmRefCurrent = confirmPasswordRef.current;
    const emailRefCurrent = emailRef.current;
    const nameRefCurrent = nameRef.current;

    return fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userRefCurrent!.value,
        password: passwordRefCurrent!.value,
        email: emailRefCurrent!.value,
        name: nameRefCurrent!.value,
      }),
    }).then((res) => {
      if (res.ok) {
        Router.replace("/login");
      }
    });
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="text-5xl font-bold text-purple-700 mb-8">
        Create an Account
      </header>

      {/* Register Form */}
      <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Register</h2>
        <input
          type="text"
          placeholder="Username"
          ref={usernameRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          ref={passwordRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          ref={confirmPasswordRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Email"
          ref={emailRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Name"
          ref={nameRef}
          className="border-2 border-gray-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
        >
          Create Account
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        Rental Matchmaker © 2025
      </footer>
    </div>
  );
}