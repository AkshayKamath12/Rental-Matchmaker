"use client"

import Autocomplete from "react-google-autocomplete";
import { useState, } from 'react';
import { useRouter } from "next/navigation";

type Location = {
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        };
    };
}

export default function DemographicPage() {
    const [location, setLocation] = useState<Location>();
    const router = useRouter();
    const onSubmit = () => {
        if(!location) {
            console.error("Location is not set")
            return;
        }
        const latitude = location.geometry.location.lat()
        const longitude = location.geometry.location.lng()
        console.log(latitude, longitude)

        const insertSubmit = async () => {
            fetch("http://localhost:8080/api/profile", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "latitude": latitude,
                    "longitude": longitude
                })
            }).then((response)=>{
                if(!response.ok){
                    console.log("error: ", response);
                }
                console.log("made request")
                router.replace('/');
            }).catch((err)=>{
                console.log(err);
            });
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