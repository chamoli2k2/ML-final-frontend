import React, { useState, useEffect } from "react";
import { Disease } from "../assets/Disease";
import { useNavigate, useLocation } from 'react-router-dom';

export default function DiseasePredictorPage() {
  let DiseaseName;
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [diseaseData, setDiseaseData] = useState({
    title: "Disease Predictor",
    description: "",
    similarDisease: []
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Handle the selection of a disease
  const handleDiseaseSelect = (disease) => {
    setSelectedDiseases([...selectedDiseases, disease]);
    setSearchText(""); // Clear searchText
  };

  // Handle the removal of a selected disease
  const handleDiseaseRemove = (disease) => {
    setSelectedDiseases(selectedDiseases.filter((item) => item !== disease));
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Handle the submit button click
  const handleSubmit = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedDiseases }),
      });

      if (response.ok) {
        const data = await response.json();
        DiseaseName = "Default Disease";
        let similarDisease = []; // Initialize an empty array

        if (data.prediction) {
        DiseaseName = data.prediction;
        console.log("DiseaseName", DiseaseName);
        // Select similar diseases at the 1st and 2nd indices (ignoring the 0th index)
        if (data.similarDisease && data.similarDisease.length > 2) {
            similarDisease = [data.similarDisease[1], data.similarDisease[2]];
            console.log("similarDisease", similarDisease);
        }
        }

        
        // Fetch additional information about the disease
        const fetchData = async () => {
          const search = "tell me about " + DiseaseName + " in 40 words";

          try {
            const response = await fetch(import.meta.env.VITE_OPENAI_URI, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': import.meta.env.VITE_OPENAI_API_KEY,
                'X-RapidAPI-Host': 'chatgpt-best-price.p.rapidapi.com'
              },
              body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                  {
                    "role": "user",
                    "content": search
                  }
                ]
              })
            });

            if (response.ok) {
              const responseObject = await response.json();
              console.log("Res", response)
              const content = responseObject.choices[0].message.content;
              setDiseaseData({ title: DiseaseName, description: content, similarDisease: similarDisease });
            }
          } catch (error) {
            console.error('Error fetching disease info:', error);
          }
        };
        fetchData();
      } else {
        console.error('Some error is occurring as a response');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (searchText) {
      const results = Disease.filter((disease) =>
        disease.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(results.slice(0, 5)); // Display up to 5 matching diseases
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  return (
    <div className="h-screen bg-darkblue-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-yellow-400 text-center mb-6">Disease Predictor</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your symptoms..."
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
            value={searchText}
            onChange={handleSearchChange}
          />
          <button
            className="mt-4 w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {selectedDiseases.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Selected Symptoms:</h2>
            <div className="mt-2 space-x-2 flex flex-wrap">
              {selectedDiseases.map((disease, index) => (
                <div className="bg-yellow-400 text-darkblue-900 py-1 px-3 rounded-full flex items-center" key={index}>
                  <p className="mr-2">{disease}</p>
                  <button
                    className="text-red-500 font-bold cursor-pointer"
                    onClick={() => handleDiseaseRemove(disease)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {searchResults.length > 0 && (
          <ul role="list" className="space-y-2 mt-4">
            {searchResults.map((disease, index) => (
              <li
                key={index}
                className="py-3 cursor-pointer text-white bg-gray-700 p-2 rounded-md hover:bg-gray-600"
                onClick={() => handleDiseaseSelect(disease)}
              >
                {disease}
              </li>
            ))}
          </ul>
        )}
        {diseaseData.title !== "Disease Predictor" && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">{diseaseData.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{diseaseData.description}</p>
            <h3 className="font-semibold text-red-400">Similar Diseases:</h3>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {diseaseData.similarDisease.map((disease, index) => (
                <li key={index}>{disease}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
