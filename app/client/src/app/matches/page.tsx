"use client"

import { useRouter } from "next/navigation"

export default function MatchesPage(){
    const router = useRouter();

    function exit(){
        router.replace("/")
    }

    const findMatches = async () => {
        fetch("http://localhost:8080/api/matches", {
            credentials: "include",
        }).then((response)=>{
            if(!response.ok){
                console.log("error: ", response);
            }
            response.json().then(data => console.log(data));
        }).catch(()=>{
            router.replace("/login");
        });
    };

    return (
            <div className="flex flex-col w-[80%] mx-32 h-screen">
                <div className="flex">
                    <main className="flex-1 p-6 w-full overflow-auto">
                        <header className="flex justify-between items-center mb-4">
                            <div className="flex flex-col items-center space-x-4">
                                <button onClick={exit}>{"<--- Back"}</button>
                            </div>

                        </header>
                        <div id="card">
                            <div className="bg-white p-8 h-full w-full flex flex-col items-center">
                                <header className="text-5xl mb-8">Matches</header>
                            </div>
                            <button onClick={findMatches} className="bg-blue-300 p-5 rounded-lg">Generate Matches</button>

                        </div>
                       
                    </main>
                </div>
                
            </div>
        
      )
}