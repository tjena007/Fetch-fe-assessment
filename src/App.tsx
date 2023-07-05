import './App.css';
import React,{useState, createContext, useEffect} from'react';
import axios from 'axios';
import { BrowserRouter as Router, Route,Routes,Navigate  } from 'react-router-dom';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { DogInfo } from './components/dog-info/dogInfo';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from "react-router-dom";

// AppContext interface
interface AppContextProps {
  currentPage: number;
  currentURL: string;
  updateContext: (newValues: Partial<AppContextProps>) => void;
}

// Initial context values
const initialAppContext: AppContextProps = {
  currentPage: 1,
  currentURL: '',
  updateContext: () => {},
};

// Create AppContext
export const AppContext = createContext<AppContextProps>(initialAppContext);

const LogoutButton = ({ setAuthenticated }: { setAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const navigate = useNavigate();

  async function logout() {
    try {
      const res = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, { withCredentials: true });
      sessionStorage.removeItem('authenticated');
      setAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error(error); // Handle error cases
      navigate('/login');
    }
  }

  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-primary mr-2 mt-2 logout-button mb-2" onClick={logout} style={{ visibility: sessionStorage.getItem('authenticated') === 'true' ? 'visible' : 'hidden', marginRight: '30px' }}>
        Logout
      </button>
    </div>
  );
};

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    setAuthenticated(isAuthenticated);
  }, []);
  
  const [contextValue, setContextValue] = useState<AppContextProps>(initialAppContext);

  // Update the AppContext value
  const updateContext = (newValues: Partial<AppContextProps>) => {
    setContextValue((prevState) => ({
      ...prevState,
      ...newValues,
    }));
  };

  return (
    <Router>
      <LogoutButton setAuthenticated={setAuthenticated} />
      <Routes>
      <Route path="/" element={authenticated ? (<Navigate to="/home" />) : (<Navigate to="/login" />)}/>
      <Route path="/login" element={authenticated? <Navigate to="/home" /> :<Login setAuthenticated={setAuthenticated} />} />
      <Route path="/home" element={ authenticated?(<AppContext.Provider value={{...contextValue,updateContext}}><Home /></AppContext.Provider>): <Navigate to="/login" /> } />
      <Route path="/doginfo" element={ <DogInfo /> } />
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App;