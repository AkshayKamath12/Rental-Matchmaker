import { useUser } from '@clerk/clerk-react'

type props = {
  changePage: (page: string) => void;
};


export default function HomePage({changePage}: props) {
  const { isSignedIn, user, isLoaded } = useUser()


  return (
    <div className="bg-gray-100 items-center flex flex-col h-screen w-screen">
      <header className="text-6xl">Hello {user?.fullName}</header>
      <table className="w-3/4 h-1/2 my-8">
        <tbody>
          <tr className="text-center">
              <td >
                <button onClick={()=>{changePage("1")}} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Fill out form
                </button>
              </td>
              <td>
                <button onClick={()=>changePage("2")} className="w-full h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2 ">
                  Find matches
                </button>
              </td>
            </tr>
        </tbody>
        
      </table>
    </div>
  )
}
