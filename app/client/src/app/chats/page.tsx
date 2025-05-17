"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CurrentChat from "@/components/currentChat";

export default function ChatsPage() {
  const router = useRouter();
  const [otherUsers, setOtherUsers] = useState<String []>(["bob", "alice", "charlie"]);
  const [currentOtherUser, setCurrentOtherUser] = useState<String | null>("bob");

  const getUsername = async () => {
    return fetch("http://localhost:8080/api/username", {
        credentials: "include",
    }).then((response) => response.text());
  };

  const { data: usernameData, isError: isUsernameError } = useQuery({
    queryKey: ["username"],
    queryFn: getUsername,
  });

  function handleExit() {
    router.replace("/");
  }

  /*
  if(usernameData){
    fetch("http://localhost:8080/api/chats/chatOtherUsers", {
      credentials: "include",
    })
        .then((response) => {
            response.json().then((data) => {
                setOtherUsers(data);
                if(data.length > 0){
                    setCurrentOtherUser("bob");
                }
            });
        })
  }
  */
  return (
    <div className="flex flex-col w-full mx-auto h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-6">
            <button
                onClick={handleExit}
                className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
            >
                {"<--- Back"}
            </button>
        </header>
        <div className="flex h-full">
            <div className="flex-grow p-4 overflow-y-auto">
                {otherUsers.map((otherUser, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentOtherUser(otherUser)}
                        className={`w-full text-left p-2 rounded-lg hover:bg-gray-200 ${currentOtherUser === otherUser ? "bg-gray-300" : ""}`}
                    >
                        {otherUser}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-y-scroll p-4">
                {
                  currentOtherUser && 
                    <CurrentChat user={"bob"} otherUser={currentOtherUser} />
                }
            </div>
        </div>
    </div>
  );
}