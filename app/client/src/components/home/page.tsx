import { useSession, useUser } from '@clerk/nextjs'
import { Button } from '@mui/material';
import { useEffect,useState } from 'react';
import createClerkSupabaseClient from '../helpers/createClient';



type props = {
  changePage: (page: string) => void;
};



export default function HomePage({changePage}: props) {
  const { user } = useUser();
  const { session } = useSession();
  const email = user?.primaryEmailAddress?.emailAddress;
  const supabase = createClerkSupabaseClient(session);

  async function waitForVariable(variable:any) {
    while (variable === undefined) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
    }
    return variable;
  }

  const fetchData = async () => {   
    await waitForVariable(user);
    await waitForVariable(session)
    const {data, error} = await supabase
        .from('Submitted-users')
        .select()
        .eq('email', email)
        if (data) {
            if(data.length != 1){
              changePage("0");
            } 
        }

        if(error){
          console.log(error);
        }
}

fetchData()


  
    useEffect(() => {
      
      
  }, [session])

  return (
    <div className="bg-gray-100 items-center flex flex-col h-screen w-screen">
      <header className="text-6xl">Hello {user?.fullName}</header>
      <table className="w-3/4 h-1/2 my-8">
        <tbody>
          <tr className="text-center">
              <td >
                <button onClick={()=>{changePage("2")}} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Fill out form
                </button>
              </td>
              <td>
                <button onClick={()=>changePage("3")} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Find matches
                </button>
              </td>
            </tr>
        </tbody>    
      </table>
      <Button onClick={()=>{
        changePage("0");
        }} variant="contained">Edit profile information</Button>
    </div>
  )
}
