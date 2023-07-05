import { useLocation, useNavigate,Navigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import './dogInfo.css';

export const DogInfo = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idParam = queryParams.get('id');
    const id = idParam ? [idParam] : []; 

    const navigate = useNavigate();

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
            if (id.length === 0) {
                navigate('/'); // Redirect to home or login page based on authentication status if id is not available
                return;
            }
            const response = await axios.post('https://frontend-take-home-service.fetch.com/dogs',id,config); 
            const dogData = response.data; // Assuming the response data is in the expected format
            setDogDetails(dogData[0]);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
    }, []);

    const handleGoBack = () => {
         window.history.back(); // Go back to the previous page
    };
    
    return (
    <div className="container">
        <h1 className="text-center">Dog Details</h1>
        {dogDetails.breed !== '' ? (
            <div className="card mx-auto mt-4 dog-card">
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
        <div className="text-center mt-4">
            <button className="btn btn-dark">Adopt me!</button>
        </div>
    </div>
    );
};