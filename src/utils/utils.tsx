import axios from "axios";
const baseUrl = 'https://frontend-take-home-service.fetch.com';

export const getDogInfo = async () => {
    // console.log(dogIDs);
    const response = await axios.post(`${baseUrl}/dogs`, [],{withCredentials: true});      
    // console.log(response.data); // Handle the response data
    //setDogIDs(response.data.resultIds);  
    //setDogs(response.data);
};