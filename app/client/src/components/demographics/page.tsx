import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { Card } from "@/components/ui/card"
import Autocomplete from "react-google-autocomplete";
import { useState,useEffect } from 'react';
import { useSession, useUser } from '@clerk/nextjs'
import createClerkSupabaseClient from '../helpers/createClient';

type props={
    changePage: (page: string) => void;
}

function DemographicPage({changePage}:props) {
    const [location, setLocation] = useState<any>();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { session } = useSession()
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress;


    const onSubmit = (data:any) => {
        
        console.log("submitted demographics")
        const name = data.name;
        const city = location.address_components[0].long_name;
        const state = location.address_components[2].long_name
        
        const insertData = async () => {
            const supabase = await createClerkSupabaseClient(session);
            const { data, error } = await supabase
            .from('Demographic-users')
            .upsert([{"name": name, "email": email, "city": city, "state": state}], { onConflict: 'email'} )
        };
        insertData()


        const insertSubmit = async () => {
            const supabase = await createClerkSupabaseClient(session);
            const { data, error } = await supabase
            .from('Submitted-users')
            .upsert([{"email": email}], {onConflict: 'email'})
            if(error == null){
                changePage("1");
            }else{
                console.log(error);
            }
        };
        insertSubmit()
    };




    return (
        <div className="flex flex-col w-[80%] mx-32 h-screen">
                    <div className="flex">
                        <main className="flex-1 p-6 w-full overflow-auto">

                            <Card className=''>
                                <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
                                    <div className='flex flex-col items-center'>
                                        <p className='mt-8 mb-4'>Enter your name:</p>
                                        <TextField 
                                            label="Name" 
                                            {...register("name", { required: "Name is required" })} 
                                            error={!!errors.name}
                                            className='w-1/2'
                                        />
                                        <p className='mt-16 mb-4'>Enter the location you are looking for properties:</p>
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
                                        <Button type="submit" variant="contained">Submit</Button>
                                    </div>
                                </form>
                                    
                                
                            </Card>
                        
                            

                        </main>
                    </div>
                    
                </div>
        
    );
}

export default DemographicPage;