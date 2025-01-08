"use client";

import { useState, useEffect } from "react";
import HomePage from "@/components/home/page"
import FormPage from "@/components/form/page";
import MatchesPage from "@/components/matches/page";
import DemographicPage from "@/components/demographics/page";
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export default function App() {
  const [page, setPage] = useState("1");
  const { user } = useUser()

  const pages = {
    "0": <DemographicPage changePage={setPage}/>,
    "1": <HomePage changePage={setPage}/>,
    "2": <FormPage changePage={setPage}/>,
    "3": <MatchesPage changePage={setPage}/>
  }


  return (
      <div className="flex flex-col space-x-8  bg-gray-100">
          {pages[page as keyof typeof pages]}
      </div>
  );
}
