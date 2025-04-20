"use client"

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation"

type matches = {
    matches: string[];
    scores: number[];
}

export default function MatchesPage(){
    const router = useRouter();
    const [range, setRange] = useState<number>(25);
    const [matches, setMatches] = useState<matches>({matches:[], scores:[]});
    console.log(matches.matches);
    
    
    function exit(){
        router.replace("/")
    }

    function handleRangeChange(event:ChangeEvent<HTMLInputElement>){
        setRange(parseInt(event.target.value));
    }

    const findMatches = async () => {
        const fetchUrl = "http://localhost:8080/api/matches/" + range.toString();
        fetch(fetchUrl, {
            credentials: "include",
        }).then((response)=>{
            if(!response.ok){
                console.log("error: ", response);
            }
            response.json().then(data => {
                setMatches({matches: data.names, scores: data.scores});
            });
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
                            <div className="w-full">
                                <div>
                                    <p>Find roomates at most {range} miles away</p>
                                    <input
                                            type="range"
                                            min="5"
                                            max="500"
                                            value={range}
                                            onChange={handleRangeChange}
                                    />
                                    <p>drag slider to adjust range</p>
                                </div>
                                
                                <button onClick={findMatches} className="bg-blue-300 p-5 rounded-lg">Generate Matches</button>
                                <table>
                                    <tbody>
                                        {
                                            matches.matches.map((match, index) =>{
                                                return <tr key={index}>
                                                    <td>
                                                        <p>{match}</p>
                                                    </td>
                                                    <td>
                                                        <p>{matches.scores[index]}</p>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                    
                                </table>
                            </div>
                            

                        </div>
                       
                    </main>
                </div>
                
            </div>
        
      )
}