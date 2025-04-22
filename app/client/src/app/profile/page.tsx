"use client";

import Autocomplete from "react-google-autocomplete";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Location = {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
};

export default function DemographicPage() {
  const [location, setLocation] = useState<Location>();
  const router = useRouter();

  const onSubmit = () => {
    if (!location) {
      console.error("Location is not set");
      return;
    }
    const latitude = location.geometry.location.lat();
    const longitude = location.geometry.location.lng();

    const insertSubmit = async () => {
      fetch("http://localhost:8080/api/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log("error: ", response);
          }
          router.replace("/");
        })
        .catch(() => {
          router.replace("/login");
        });
    };
    insertSubmit();
  };

  return (
    <div className="w-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
    <button
          onClick={()=>{router.replace("/")}}
          className="text-lg text-blue-600 hover:text-blue-800 font-semibold mt-3 mx-3"
        >
          {"<--- Back"}
        </button>
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="text-4xl font-bold text-purple-700 mb-8">
        Set Your Preferred Location
      </header>

      {/* Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-lg flex flex-col items-center">
        <p className="text-lg font-medium text-gray-700 mb-6 text-center">
          Enter the location you would like to rent around
        </p>
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #d1d5db",
            borderRadius: "8px",
          }}
          onPlaceSelected={(place) => {
            setLocation(place);
          }}
          options={{
            types: ["(regions)"],
            componentRestrictions: { country: "usa" },
          }}
          className="mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
        >
          Submit
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        Rental Matchmaker © 2025
      </footer>
    </div>
    </div>
  );
}