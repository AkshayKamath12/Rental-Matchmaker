"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { QUESTIONS } from "./questions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Question = {
  questionNumber: number;
  optionSelected: number;
  weightage: number;
};

export default function FormPage() {
  const router = useRouter();
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [currentQuestionChanged, setCurrentQuestionChanged] = useState(false);

  const [questionsData, setQuestionsData] = useState<Question[]>(
    Array.from({ length: QUESTIONS.length }, (_, i) => ({
      questionNumber: i,
      optionSelected: -1,
      weightage: 50,
    }))
  );

  function handleExit() {
    saveQuestion();
    router.replace("/");
  }

  function handleOptionSelect(optionSelected: number) {
    setQuestionsData(
      questionsData.map((questionData) =>
        questionData.questionNumber === questionNumber
          ? { ...questionData, optionSelected: optionSelected }
          : questionData
      )
    );
    setCurrentQuestionChanged(true);
  }

  function handleWeightageChange(event: ChangeEvent<HTMLInputElement>) {
    const weightage = parseInt(event.target.value);
    setQuestionsData(
      questionsData.map((questionData) =>
        questionData.questionNumber === questionNumber
          ? { ...questionData, weightage: weightage }
          : questionData
      )
    );
    setCurrentQuestionChanged(true);
  }

  function handleNext() {
    saveQuestion();
    setQuestionNumber((prevState) => prevState + 1);
  }

  function handlePrev() {
    saveQuestion();
    setQuestionNumber((prevState) => prevState - 1);
  }

  function checkReadySubmit() {
    if (questionNumber === QUESTIONS.length - 1) {
      for (const question of questionsData) {
        if (question.optionSelected === -1) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  async function saveQuestion() {
    if (currentQuestionChanged) {
      const optionSelected = questionsData[questionNumber].optionSelected;
      const weight = questionsData[questionNumber].weightage;
      fetch("http://localhost:8080/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: questionNumber,
          answer: optionSelected,
          weight: weight,
        }),
      }).catch((error) => {
        console.log(error);
      });
      setCurrentQuestionChanged(false);
    }
  }

  async function getQuestionsData() {
    return fetch("http://localhost:8080/api/answers", {
      credentials: "include",
    }).then((res) => res.json());
  }

  function handleSubmit() {
    saveQuestion();
    const submitData = async () => {
      return fetch("http://localhost:8080/api/submit", {
        method: "POST",
        credentials: "include",
      }).then(() => console.log("submitted"));
    };
    submitData().then(() => {
      router.replace("/");
    });
  }

  const { data, error: getQuestionsError } = useQuery({
    queryKey: ["getQuestions"],
    queryFn: getQuestionsData,
  });

  if (getQuestionsError) {
    router.replace("/login");
  }

  useEffect(() => {
    if (data) {
      setQuestionsData((prev) => {
        let newQuestions = [...prev];
        for (const answer of data) {
          const index = answer.question;
          newQuestions[index].questionNumber = index;
          newQuestions[index].optionSelected = answer.answer;
          newQuestions[index].weightage = answer.weight;
        }
        return newQuestions;
      });
    }
  }, [data]);

  return (
    <div className="flex flex-col w-full mx-auto h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={handleExit}
          className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
        >
          {"<--- Back"}
        </button>
        <h1 className="text-4xl font-bold text-purple-700">
          Question {questionNumber + 1} of {QUESTIONS.length}
        </h1>
      </header>

      <div className="bg-white w-[75%] ml-[12.5%] p-8 rounded-lg shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {QUESTIONS[questionNumber].question}
        </h2>
        {QUESTIONS[questionNumber].options.map((option, key) => {
          const isSelected =
            questionsData[questionNumber].optionSelected === key;
          const className = isSelected
            ? "w-full mb-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
            : "w-full mb-4 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-300";
          return (
            <button
              key={key}
              onClick={() => handleOptionSelect(key)}
              className={className}
            >
              {option}
            </button>
          );
        })}
        <p className="mt-6 text-lg font-medium text-gray-700">
          How much does this matter to you on a scale of 0-100?
        </p>
        <input
          type="range"
          min="0"
          max="100"
          value={questionsData[questionNumber].weightage}
          onChange={handleWeightageChange}
          className="w-full mt-4 accent-blue-500"
        />
        <p className="text-lg font-semibold text-blue-600 mt-2">
          {questionsData[questionNumber].weightage}
        </p>
      </div>

      <div className="flex justify-between mt-6 ">
        <button
          disabled={questionNumber === 0}
          onClick={handlePrev}
          className="bg-blue-500 ml-[12.5%] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          disabled={questionNumber === QUESTIONS.length - 1}
          onClick={handleNext}
          className="bg-purple-500 mr-[12.5%] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {checkReadySubmit() && (
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}