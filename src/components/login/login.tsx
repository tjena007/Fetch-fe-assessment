import './login.css';
import logo from '../../utils/images/fetcnLogo.svg'
import { LoginForm } from "../../utils/components/loginForm";

interface LoginProps {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  }

export const Login = ({ setAuthenticated }: LoginProps) => { 
  return (
    <div className="container d-flex flex-column align-items-center">
      <img src={logo} alt="Logo" className="img-fluid logo-image" />
      <h1 className="text-center">Fetch Frontend Assessment</h1>
      <h3 className="text-center">Adopt Your Perfect Pup</h3>     
      <div className="mt-4">
      <h5 className="text-center">To get started, enter your name and email to see all the available dogs!</h5>
        <LoginForm setAuthenticated={setAuthenticated} />
      </div>
    </div>
  );
};