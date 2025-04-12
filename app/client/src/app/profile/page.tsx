"use client"

import Autocomplete from "react-google-autocomplete";
import { useState, } from 'react';


export default function DemographicPage() {
    const [location, setLocation] = useState<any>();

    const onSubmit = () => {
        
        const latitude = location.geometry.location.lat()
        const longitude = location.geometry.location.lng()

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
                                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
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
                                    <button onClick={onSubmit}>Submit</button>
                                </div>
                            </div>
                        </main>
                    </div>
                    
                </div>
        
    );
}