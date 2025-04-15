"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [username, setUsername] = useState("")
  const Router = useRouter();
    
  const getUsername = async () =>{
    return fetch("http://localhost:8080/api/username", {
      credentials:"include"
    }).then(response => response.text());
        
  }
    
  const getProfile = async () =>{
    return fetch("http://localhost:8080/api/profile", {
      credentials:"include"
    }).then(response => response.json())
  }

  const { data: profileData, error: profileError } = useQuery({queryKey: ['profile'], queryFn: getProfile});
  if(profileData){
    console.log(profileData);
  }else if(profileError){
    console.log("profile error");
  }

  
  const { data: usernameData } = useQuery({queryKey: ['username'], queryFn: getUsername});

  


  return (
    <div className="bg-gray-100 items-center flex flex-col h-screen w-screen">
      <header className="text-6xl">Hello {usernameData}</header>
      <table className="w-3/4 h-1/2 my-8">
        <tbody>
          <tr className="text-center">
              <td >
                <button onClick={()=>{Router.push("/form")}} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Fill out form
                </button>
              </td>
              <td>
                <button onClick = {()=>{Router.push("/matches")}} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Find matches
                </button>
              </td>
            </tr>
        </tbody>    
      </table>
      <button></button>
    </div>
  )
}