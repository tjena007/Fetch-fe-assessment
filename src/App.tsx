import './App.css';
import React,{useState} from'react';
import axios from 'axios';
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
*/

const LogoutButton = () => {
  const navigate = useNavigate();

  async function logout() {
    try {
      const res = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, { withCredentials: true });
      // console.log(res);
      navigate('/login');
    } catch (error) {
      console.error(error); // Handle error cases
      navigate('/login');
    }
  }

  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-primary mr-2 mt-2 logout-button mb-2" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  //console.log(authenticated);

  return (
    <Router>
      <LogoutButton />
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/home" element={ <Home />} />
        <Route path="/doginfo" element={<DogInfo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App;