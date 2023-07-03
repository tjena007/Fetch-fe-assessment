import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'

interface LoginProps {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  }

export const Login = ({ setAuthenticated }: LoginProps) => {
  const navigate = useNavigate();
  async function login(name: any, email: any) {
    try {
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
        name,
        email
      },{withCredentials: true});
      
      // Successful login, handle the response
    //   console.log(response.data);
      setAuthenticated(true);
      navigate('/home');
      
      // Perform any necessary actions after successful login
    } catch (error) {
      console.error(error);
      
      // Handle error cases
    }
  }
  
  function LoginForm() {
    const handleSubmit = async (event:any) => {
      event.preventDefault();
      const { name, email } = event.target.elements;
  
      await login(name.value, email.value);
    };
  
    return (
        <div className="container d-flex justify-content-center">
            <form onSubmit={handleSubmit} className="text-center">
                    <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" className="form-control" placeholder="Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className="form-control" placeholder="Email" />
                </div>
                <div className="form-group">
                    <span className="form-text text-muted">
                        <button type="submit" className="btn btn-primary logout-button">
                            Login
                        </button>
                    </span>
                </div>
            </form>
        </div>
    

    );
    
  }

  return (
    <div className="container d-flex flex-column align-items-center">
      <h1 className="text-center">Fetch Frontend Assessment</h1>
      <h3 className="text-center">Find Your Perfect Pup</h3>
      <h4 className="text-center">To get started, enter your name and email to see all the available dogs!</h4>
      <div className="mt-4">
        <LoginForm />
      </div>
    </div>
  );
};