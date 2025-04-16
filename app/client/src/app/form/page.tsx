"use client"
import { useState, ChangeEvent, useEffect } from "react"
import { QUESTIONS } from "./questions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Question = {
    questionNumber: number,
    optionSelected: number,
    weightage: number
}

export default function FormPage(){	
    const router = useRouter();
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [currentQuestionChanged, setCurrentQuestionChanged] = useState(false);

    const [questionsData, setQuestionsData] = useState<Question[]>(Array.from({ length: QUESTIONS.length }, (_, i) => ({questionNumber: i, optionSelected: -1, weightage: 50})));

    function handleExit(){
        router.replace("/");
    }

    function handleOptionSelect(optionSelected: number){
        setQuestionsData(
            questionsData.map((questionData)=> 
                questionData.questionNumber === questionNumber ? {...questionData, optionSelected: optionSelected} : questionData
            )
        );
        setCurrentQuestionChanged(true);
    }

    function handleWeightageChange(event:ChangeEvent<HTMLInputElement>){
        const weightage = parseInt(event.target.value);
        setQuestionsData(
            questionsData.map((questionData)=> 
                questionData.questionNumber === questionNumber ? {...questionData, weightage: weightage} : questionData
            )
        );
        setCurrentQuestionChanged(true);
    }

    function handleNext(){
        console.log(currentQuestionChanged);
        if(currentQuestionChanged){
            saveQuestion();
        }
        setQuestionNumber((prevState) => prevState + 1);
    }

    function handlePrev(){
        if(currentQuestionChanged){
            saveQuestion();
        }
        setQuestionNumber((prevState) => prevState - 1);
    }

    async function saveQuestion(){
        const optionSelected = questionsData[questionNumber].optionSelected
        const weight = questionsData[questionNumber].weightage
        fetch("http://localhost:8080/api/answers", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                question: questionNumber,
                answer: optionSelected,
                weight: weight
            })
            }).catch((error)=>{
                console.log(error);
            }
        )
        setCurrentQuestionChanged(false);
    }

    async function getQuestionsData(){
        return fetch("http://localhost:8080/api/answers", {
            credentials: "include"
        }).then(res => res.json())
    }

    async function handleSubmit(){
        

    }
    
    const {data} = useQuery({queryKey: ['getQuestions'], queryFn: getQuestionsData});

    useEffect(()=>{
        if(data){
            console.log(data);
            
            setQuestionsData((prev) => {
                let newQuestions = [...prev];
                for(const answer of data){
                    const index = answer.question;
                    newQuestions[index].questionNumber = index;
                    newQuestions[index].optionSelected = answer.answer;
                    newQuestions[index].weightage = answer.weight;
                }
                console.log(newQuestions);
                return newQuestions;
            });            
        }
    }, [data])

    return (
            <div className="flex flex-col w-[80%] mx-32 h-screen">
                <div className="flex">
                    <main className="flex-1 p-6 w-full overflow-auto">
                        <header className="flex justify-between items-center mb-4">
                            <div className="flex flex-col items-center space-x-4">
                                <button onClick={handleExit}>{"<--- Back"}
                                </button>
                            </div>

                        </header>
                        <div id="card">
                            <div className="bg-white p-8 h-full w-full flex flex-col items-center">
                                <header className="text-5xl mb-8">{QUESTIONS[questionNumber].question}</header>
                                {QUESTIONS[questionNumber].options.map((option, key)=>{
                                    let className = questionsData[questionNumber].optionSelected == key ? "w-3/4 mb-8 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ring-4 outline-none ring-cyan-300 dark:ring-cyan-800" : "w-3/4 mb-8 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    return <button key={key} onClick={()=>handleOptionSelect(key)} className={className}>{option}</button>;
                                })}
                                <p className="mt-8">How much does this matter to you on a scale of 0-100?</p>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={questionsData[questionNumber].weightage}
                                    onChange={handleWeightageChange}
                                />
                                <p>{questionsData[questionNumber].weightage}</p>
                            </div>

                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <button disabled={questionNumber === 0 } onClick={handlePrev}>Previous</button>
                                <button disabled={questionNumber === QUESTIONS.length - 1} onClick={handleNext}>Next</button>
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                <button onClick={handleSubmit}>
                                    SUBMIT
                                </button>
                                
                            </div>
                        </div>
                        

                    </main>
                </div>
                
            </div>
        
      )
}