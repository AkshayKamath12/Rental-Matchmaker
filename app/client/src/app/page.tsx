"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export default function HomePage() {
  const Router = useRouter();

  const getUsername = async () => {
    return fetch("http://localhost:8080/api/username", {
      credentials: "include",
    }).then((response) => response.text());
  };

  const { data: usernameData, isError: isUsernameError } = useQuery({
    queryKey: ["username"],
    queryFn: getUsername,
  });

  if (isUsernameError) {
    Router.push("/login");
  }

  const handleLogout = async () => {
    deleteCookie("jwt-token");
    Router.push("/login");
  };

  const handleEditProfile = () => {
    Router.push("/profile");
  }

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="flex w-full justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 shadow-md">
        <h3 className="text-4xl font-bold text-white">
          Welcome, {usernameData || "User"}!
        </h3>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md"
        >
          Log Out
        </button>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center justify-center flex-grow w-full">
        <table className="w-3/4 h-1/2 my-8">
          <tbody>
            <tr className="text-center">
              <td>
                <button
                  onClick={() => {
                    Router.push("/form");
                  }}
                  className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center"
                >
                  Fill Out Form
                </button>
              </td>
              <td>
                <button
                  onClick={() => {
                    Router.push("/matches");
                  }}
                  className="w-full h-full text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center"
                >
                  Find Matches
                </button>
              </td>
            </tr>
            <tr className="text-center">
              <td>
                  <button
                  onClick={() => {
                    Router.push("/chats");
                  }}
                  className="w-full h-full text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center"
                >
                  Open chats
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleEditProfile} type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Edit Profile</button>

      </div>

      {/* Footer Section */}
      <footer className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-center text-white font-medium shadow-md">
        Rental Matchmaker © 2025
      </footer>
    </div>
  );
}