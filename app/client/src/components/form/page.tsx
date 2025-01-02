import { useState } from "react"
import { Card } from "@/components/ui/card"
import { QUESTIONS } from "./questions";

type props={
  changePage: (page: string) => void;
}

export default function FormPage({changePage}: props){
    const [value, setValue] = useState(30);
    const [questionNumber, setQuestionNumber] = useState(0);

    const handleChange = (event:any) => {
        setValue(event.target.value);
      };
    
    return (
            <div className="flex flex-col w-[80%] mx-32 h-screen">
                <div className="flex">
                    <main className="flex-1 p-6 w-full overflow-auto">
                        <header className="flex justify-between items-center mb-4">
                            <div className="flex flex-col items-center space-x-4">
                                <button onClick={()=>{changePage('0')}}>{"<--- Back"}
                                </button>
                            </div>

                        </header>
                        <Card>
                            <div className="bg-white p-8 h-full w-full flex flex-col items-center">
                                <header className="text-5xl mb-8">{QUESTIONS[questionNumber].question}</header>
                                {QUESTIONS[questionNumber].options.map((option)=>{
                                    return <button className="w-3/4 mb-8 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{option}</button>
                                })}
                                <p className="mt-8">How much does this matter to you on a scale of 0-100?</p>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={value}
                                    onChange={handleChange}
                                />
                                <p>{value}</p>
                            </div>

                        </Card>
                        <div className="flex flex-row justify-between">
                            <button disabled={questionNumber === 0}>Previous</button>
                            <button disabled={questionNumber === QUESTIONS.length - 1}>Next</button>
                        </div>

                    </main>
                </div>
                
            </div>
        
      )
}