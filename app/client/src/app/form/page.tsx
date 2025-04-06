import { useState, useEffect } from "react"
import { QUESTIONS } from "./questions";


type props={
  changePage: (page: string) => void;
}

export default function FormPage({changePage}: props){	


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

        };
      
        insertData();
    };

    function handleQuestionChange(answer: number){

    }    

    const checkCompleted = async () => {

    };
    checkCompleted()
    

    const checkCurrentQuestion = async (q_num: number) => {

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
                        <div id="card">
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

                        </div>
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