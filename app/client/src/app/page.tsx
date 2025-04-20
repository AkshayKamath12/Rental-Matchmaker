"use client"
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { deleteCookie} from 'cookies-next';

export default function HomePage() {
  const Router = useRouter();
    
  const getUsername = async () =>{
    return fetch("http://localhost:8080/api/username", {
      credentials:"include"
    }).then(response => response.text());
        
  }

  
  const { data: usernameData, isError:isUsernameError } = useQuery({queryKey: ['username'], queryFn: getUsername});

  if(isUsernameError){
    Router.push("/login");
  }
  
  const handleLogout = async () => {
    deleteCookie("jwt-token");
    Router.push("/login");
  }


  return (
    <div className="bg-gray-100 items-center flex flex-col h-screen w-screen">
      <div className="flex w-full justify-center p-5">
        <h3 className="text-6xl">
          Hello {usernameData}
        </h3>
        <button onClick={handleLogout} className="absolute right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Log Out</button>

      </div>
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