"use client";

import { ChangeEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MatchMessageChatModal from "@/components/MatchMessageModal";

type match = {
  username: string;
  score: number;
};

export default function MatchesPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [range, setRange] = useState<number>(25);
  const [matches, setMatches] = useState<match[]>([]);
  const [modalUsername, setModalUsername] = useState<string>("");
  console.log(matches);

  function exit() {
    router.replace("/");
  }

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>) {
    setRange(parseInt(event.target.value));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const value = parseFloat(event.target.value);
    if(value < 1){
      setRange(1);
    }else if (value > 1000){
      setRange(1000);
    }else{
      setRange(value);
    }
  }

  function handleMessageSend(recipient: string, message: string) {
    fetch("http://localhost:8080/api/chats/privateRegular", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        recipient: recipient,
        content: message,
      }),
    });

    console.log(`Sending message to ${recipient}: ${message}`);
    setModalUsername("");
    
  }

  const findMatches = async () => {
    const fetchUrl = "http://localhost:8080/api/matches/" + range.toString();
    fetch(fetchUrl, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          console.log("error: ", response);
        }
        response.json().then((data) => {
          setMatches(data);
        });
      })
      .catch(() => {
        router.replace("/login");
      });
  };


  return (
    <div className="flex flex-col w-full mx-auto h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={exit}
          className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
        >
          {"<--- Back"}
        </button>
        <h1 className="text-4xl font-bold text-purple-700">Find Matches</h1>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-md w-3/4 ml-[12.5%]">
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">
            Find roommates within <input type="number" value={range} ref={inputRef} onChange={handleInputChange} className="text-blue-600 w-[7ch] border rounded text-center"></input>
            miles
          </p>
          <input
            type="range"
            min="1"
            max="1000"
            value={range}
            onChange={handleRangeChange}
            className="w-full mt-4 accent-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">Drag slider to adjust range</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={findMatches}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
          >
            Generate Matches
          </button>
        </div>
      </div>

      <div className="mt-8 w-3/4 ml-[12.5%]">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Score</th>
              <th className="py-3 px-4 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-blue-100`}
              >
                <td className="py-3 px-4">{match.username}</td>
                <td className="py-3 px-4">{match.score}</td>
                <td className=""><button onClick={() => {setModalUsername(match.username)}} className="bg-blue-500 rounded-lg p-2">Message</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {
          modalUsername && <MatchMessageChatModal
            matchUsername={modalUsername}
            closeModal={() => setModalUsername("")}
            sendMessage={handleMessageSend}
          />
        }
      </div>
    </div>
  );
}