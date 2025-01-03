"use client";
import { useState } from "react";
import HomePage from "@/components/home/page"
import FormPage from "@/components/form/page";

export default function App() {
  const [page, setPage] = useState("0");
  const pages = {
    "0": <HomePage changePage={setPage}/>,
    "1": <FormPage changePage={setPage}/>
  }
  return (
      <div className="flex flex-col space-x-8  bg-gray-100">
          {pages[page as keyof typeof pages]}
      </div>
  );
}
