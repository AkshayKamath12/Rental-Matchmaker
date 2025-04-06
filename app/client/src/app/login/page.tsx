import LoginButton from "@/components/loginComponents/loginButton";
export default function LoginPage() {
    return (
      <div className="flex flex-col w-[80%] mx-32 h-screen items-center justify-center">
        <header className="text-5xl mb-8">Login</header>
        <div className="flex flex-col items-center space-x-4">
            <input type="text" placeholder="Username" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input type="password" placeholder="Password" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <LoginButton />
            <button className="bg-blue-500 text-white rounded-md p-2 mt-4">Register</button>
        </div>
      </div>
    )
  }