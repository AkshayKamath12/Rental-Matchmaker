import Autocomplete from "react-google-autocomplete";
import { useState, } from 'react';


type props={
    changePage: (page: string) => void;
}

function DemographicPage({changePage}:props) {
    const [location, setLocation] = useState<any>();

    const onSubmit = (data:any) => {
        
        console.log("submitted demographics")
        const name = data.name;
        const city = location.address_components[0].long_name;
        const state = location.address_components[2].long_name
        
        const insertData = async () => {
            
        };
        insertData()


        const insertSubmit = async () => {
        
        };
        insertSubmit()
    };




    return (
        <div className="flex flex-col w-[80%] mx-32 h-screen">
                    <div className="flex">
                        <main className="flex-1 p-6 w-full overflow-auto">
                            <div id="card">
                                <div className='flex flex-col items-center'>
                                    <p>Enter the location you would like to rent around</p>
                                    <Autocomplete
                                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
                                        style={{ width: "50%" }}
                                        onPlaceSelected={(place) => {
                                            setLocation(place);
                                        }}
                                        options={{
                                        types: ["(regions)"],
                                        componentRestrictions: { country: "usa" },
                                        }}
                                        className='outline mb-8'
                                    />
                                    <button>Submit</button>
                                </div>
                            </div>
                        </main>
                    </div>
                    
                </div>
        
    );
}

export default DemographicPage;