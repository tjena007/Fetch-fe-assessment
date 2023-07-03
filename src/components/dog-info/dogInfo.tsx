import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';


export const DogInfo = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idParam = queryParams.get('id');
    const id = idParam ? [idParam] : []; // Convert single value to array
    

    const [dogDetails, setDogDetails] = useState({
        img:'',
        name: '',
        age: '',
        breed: '',
        zip_code: '',
        id: ''
    });

    
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Make API call to fetch dog details
            console.log(config);
            const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs',id,config); 
            const dogData = response.data; // Assuming the response data is in the expected format
            console.log(dogData);
            setDogDetails(dogData[0]); // Update the state with the dog details
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
      }, []);

      const navigate = useNavigate();

      const handleGoBack = () => {
        window.history.back(); // Go back to the previous page
      };
    
      return (
        <div className="container">
            <h1 className="text-center">Dog Details</h1>
            {dogDetails.breed !== '' ? (
                <div className="card mx-auto mt-4">
                <img src={dogDetails.img} className="card-img-top" alt={dogDetails.name} />
                <div className="card-body">
                    <h5 className="card-title">{dogDetails.name}</h5>
                    <p className="card-text">
                    <strong>Age:</strong> {dogDetails.age}
                    <br />
                    <strong>Breed:</strong> {dogDetails.breed}
                    <br />
                    <strong>Zip Code:</strong> {dogDetails.zip_code}
                    </p>
                </div>
                </div>
            ) : (
                <p className="text-center mt-4">Loading dog details...</p>
            )}
            <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleGoBack}>
                Go Back
                </button>
            </div>
            </div>
      );
};