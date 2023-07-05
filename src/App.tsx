import './App.css';
import React,{useState, createContext, useContext, useEffect} from'react';
import axios, { AxiosRequestConfig } from 'axios';
import { BrowserRouter as Router, Route,Routes,Navigate  } from 'react-router-dom';
import { Login } from './components/login/login';
import { Home } from './components/landing/home';
import { DogInfo } from './components/dog-info/dogInfo';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from "react-router-dom";


// to do
/*
1.make api connection --done
2.filter dog by breed --done
3. make results paginated(50 results per page) --done
4. sort results alphabetically by dog breed, create option to sort ascending or descending --done
5. show all info of each dog except id (id: string --done
    img: string
    name: string
    age: number
    zip_code: string
    breed: string)
  6. create page to show a particular dog, get images from unsplash api using dog breed as request parameter --done
  7. Improve UI
  8. Error handling
  9. Add further filter options: filter by location 

  ---- final tasks ----
  1. create context to store url and page number of results --done
  2. update pagination logic --done
  3. add authentication logic to the routes --done
  4. double chek error handling
  5. code readability
  6. add clear filters functionality
  7. deploy the updated app
*/

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