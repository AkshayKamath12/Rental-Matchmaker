import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { QUESTIONS } from "./questions";
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import createClerkSupabaseClient from "../helpers/createClient";

type props={
  changePage: (page: string) => void;
}

export default function FormPage({changePage}: props){	

    const { user } = useUser()
    const {session} = useSession();
    const email = user?.primaryEmailAddress?.emailAddress;
    const [checkComplete, setCheckComplete] = useState(false);
    const [questionData, setQuestionData] = useState({
        "questionNumber": 0,
        "optionSelected": -1,
        "weightage": 50
    });

    const handleChange = (event:any) => {
        let val = event.target.value
        setQuestionData({...questionData, "weightage": val})
        const insertData = async () => {
            const supabase = await createClerkSupabaseClient(session);
            const { data, error } = await supabase
            .from('Form-responses')
            .upsert([{"email": email, "q_num": questionNumber, "weightage": val}], { onConflict: 'email, q_num'} )
            if(error){
                console.log(error)
            }
        };
      
        insertData();
    };

    function handleQuestionChange(answer: number){
        setQuestionData({...questionData, "optionSelected": answer })
        const insertData = async () => {
            const supabase = await createClerkSupabaseClient(session);
            const { data, error } = await supabase
            .from('Form-responses')
            .upsert([{"email": email, "q_num": questionNumber, "response": answer}], { onConflict: 'email, q_num'} ) 
        };
        insertData();
    }    

    const checkCompleted = async () => {
        const supabase = await createClerkSupabaseClient(session);
        const { data, error } = await supabase
            .from('Form-responses')
            .select()
            .eq('email', email)
        if(error == null){
            setCheckComplete(data.length == QUESTIONS.length);
        }else{
            setCheckComplete(false);
        }
    };
    checkCompleted()
    

    const checkCurrentQuestion = async (q_num: number) => {
        const supabase = await createClerkSupabaseClient(session);
        const { data, error} = await supabase
        .from('Form-responses')
        .select('response, weightage')
        .eq('email', email)
        .eq('q_num', q_num)
        if(data != null && data.length == 1 ){
            setQuestionData({"questionNumber": q_num, "optionSelected": data[0].response, "weightage": data[0].weightage});
        }
    };
    

    function handleNext(){
        let nextQuestion = questionNumber + 1;
        setQuestionData({"questionNumber": nextQuestion, "optionSelected": -1, "weightage": 50})
        checkCurrentQuestion(nextQuestion)
        
    }

    function handlePrev(){
        let prevQuestion = questionNumber - 1;
        setQuestionData({"questionNumber": prevQuestion, "optionSelected": -1, "weightage": 50})
        checkCurrentQuestion(prevQuestion)
    }

    function handleSubmit(){
        const submit = async () => {
            const supabase = await createClerkSupabaseClient(session);
            const {error} = await supabase
            .from('Submitted-users')
            .upsert([{"email": email}], { onConflict: 'email'} )
            if(error){
                console.log(error)
            }
        };
        submit()
        changePage('1')
    }

    

    useEffect(() => {
        checkCurrentQuestion(0)
    }, []);

    const {questionNumber, optionSelected, weightage} = questionData;
    return (
            <div className="flex flex-col w-[80%] mx-32 h-screen">
                <div className="flex">
                    <main className="flex-1 p-6 w-full overflow-auto">
                        <header className="flex justify-between items-center mb-4">
                            <div className="flex flex-col items-center space-x-4">
                                <button onClick={()=>{changePage('1')}}>{"<--- Back"}
                                </button>
                            </div>

                        </header>
                        <Card>
                            <div className="bg-white p-8 h-full w-full flex flex-col items-center">
                                <header className="text-5xl mb-8">{QUESTIONS[questionNumber].question}</header>
                                {QUESTIONS[questionNumber].options.map((option, key)=>{
                                    let className = optionSelected == key ? "w-3/4 mb-8 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ring-4 outline-none ring-cyan-300 dark:ring-cyan-800" : "w-3/4 mb-8 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    return <button key={key} onClick={()=>handleQuestionChange(key)} className={className}>{option}</button>;
                                })}
                                <p className="mt-8">How much does this matter to you on a scale of 0-100?</p>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={questionData.weightage}
                                    onChange={handleChange}
                                />
                                <p>{questionData.weightage}</p>
                            </div>

                        </Card>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <button disabled={questionNumber === 0 } onClick={handlePrev}>Previous</button>
                                <button disabled={questionNumber === QUESTIONS.length - 1} onClick={handleNext}>Next</button>
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                {checkComplete &&  <button onClick={handleSubmit}>
                                    SUBMIT
                                </button>}
                                
                            </div>
                        </div>
                        

                    </main>
                </div>
                
            </div>
        
      )
}