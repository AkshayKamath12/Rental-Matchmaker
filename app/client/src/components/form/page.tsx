import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { QUESTIONS } from "./questions";
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

type props={
  changePage: (page: string) => void;
}

export default function FormPage({changePage}: props){
    const { session } = useSession()
	
	// Create a custom supabase client that injects the Clerk Supabase token into the request headers
	function createClerkSupabaseClient() {
	  return createClient(
	    process.env.NEXT_PUBLIC_SUPABASE_URL!,
	    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	    {
	      global: {
	        // Get the custom Supabase token from Clerk
	        fetch: async (url, options = {}) => {
		        // The Clerk `session` object has the getToken() method      
	          const clerkToken = await session?.getToken({
		          // Pass the name of the JWT template you created in the Clerk Dashboard
		          // For this tutorial, you named it 'supabase'
	            template: 'supabase',
	          })
	          
	          // Insert the Clerk Supabase token into the headers
		        const headers = new Headers(options?.headers)
	          headers.set('Authorization', `Bearer ${clerkToken}`)
	          
	          // Call the default fetch
	          return fetch(url, {
	            ...options,
	            headers,
	          })
	        },
	      },
	    },
	  )
	}

    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress;
    const [questionNumber, setQuestionNumber] = useState(0);
    const [checkComplete, setCheckComplete] = useState(false);
    const [questionData, setQuestionData] = useState({
        "optionSelected": -1,
        "weightage": 50
    });

    const handleChange = (event:any) => {
        let val = event.target.value
        setQuestionData({...questionData, "weightage": val})
        const insertData = async () => {
            const supabase = await createClerkSupabaseClient();
            const { data, error } = await supabase
            .from('Form-responses')
            .upsert([{"email": email, "q_num": questionNumber, "weightage": val}], { onConflict: 'email, q_num'} )
            console.log(error)
        };
      
        insertData();
    };

    function handleQuestionChange(answer: number){
        const insertData = async () => {
            const supabase = await createClerkSupabaseClient();
            const { data, error } = await supabase
            .from('Form-responses')
            .upsert([{"email": email, "q_num": questionNumber, "response": answer}], { onConflict: 'email, q_num'} )
            setQuestionData({...questionData,"optionSelected": answer })
        };
      
        insertData();
    }    

    const checkCompleted = async () => {
        const supabase = await createClerkSupabaseClient();
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
        const supabase = await createClerkSupabaseClient();
        const { data, error} = await supabase
        .from('Form-responses')
        .select('response, weightage')
        .eq('email', email)
        .eq('q_num', q_num)
        console.log(data);
        if(data != null){
            setQuestionData({"optionSelected": data[q_num].response, "weightage": data[q_num].weightage});
        }
    };
    

    function handleNext(){
        setQuestionNumber(questionNumber + 1);
        checkCurrentQuestion(questionNumber)
        
    }

    function handlePrev(){
        setQuestionNumber(questionNumber - 1);
        checkCurrentQuestion(questionNumber)
    }


    useEffect(() => {
        let val = checkCurrentQuestion(0)
        console.log("val = " + val)
    }, []);

    const {optionSelected, weightage} = questionData;

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
                                {QUESTIONS[questionNumber].options.map((option, key)=>{
                                    console.log(optionSelected + " " + key);
                                    if(optionSelected == key){
                                        console.log("option selected = " + optionSelected)
                                    }
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
                                {checkComplete &&  <button>
                                    SUBMIT
                                </button>}
                                
                            </div>
                        </div>
                        

                    </main>
                </div>
                
            </div>
        
      )
}