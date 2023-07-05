import axios, { AxiosRequestConfig } from 'axios';
import React, { Component,useContext,useEffect,useState } from'react';
import './home.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {AppContext} from '../../App';

interface DropdownProps {
    options: string[];
    onSelect: (selectedOptions: string[]) => void;
}

interface Dog {
    id: string;
    name: string;
    age: number;
    breed: string;
    zip_code: string;
    img: string;
}

interface DogTableProps {
    dogs: Record<string, Dog>;
}

interface AppContextProps {
    config: AxiosRequestConfig;
    currentPage: number;
    currentURL: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
    const handleOptionSelect = (option: string) => {
      const updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((selectedOption) => selectedOption !== option)
        : [...selectedOptions, option];
  
      setSelectedOptions(updatedOptions);
      onSelect(updatedOptions);
    };
  
    return (
      <div>
        <select
          multiple
          value={selectedOptions}
          onChange={(e) => handleOptionSelect(e.target.value)}
        >
          <option disabled value="">
            Select breeds
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

const DogTable: React.FC<DogTableProps> = ({ dogs }) => {
    //console.log(dogs);

    return (
        <div className="table-responsive">
          {Object.keys(dogs).length === 0 ? (
            <p className='font-color'>No results found.</p>
          ) : (
            <table className="text-center custom-table mx-md-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Breed</th>
                  <th>Zipcode</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dogs).map(([id, values]) => (
                  <tr key={id}>
                    <td className="align-middle">
                      <Link to={`/doginfo?id=${values.id}`} state={dogs} className="row-link">
                        {values.name}
                      </Link>
                    </td>
                    <td className="align-middle">{values.age}</td>
                    <td className="align-middle">{values.breed}</td>
                    <td className="align-middle">{values.zip_code}</td>
                    <td className="align-middle">
                      <img className="img-thumbnail custom-image" src={values.img} alt={values.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
       
}
  
export const Home = () => {

    const appContext = useContext(AppContext);

    const baseUrl = 'https://frontend-take-home-service.fetch.com';
    const [dogIDs, setDogIDs] = useState([]);
    const [dogs, setDogs] = useState<{
        [key:string]: {age:number; breed:string; id:string;img:string;name:string;zip_code:string};
    }>({});
    const [prevIDs,setprevIDs] = useState('');
    const [nextIDs,setnextIDs] = useState('');
    const [totalPages,settotalPages] = useState(0);
    const [reloadKey, setReloadKey] = useState(0);
    const [breeds, setBreeds] = useState([]);
    const [sort, setSort] = useState<{ option: string; order: string }>({ option: 'breed', order: 'asc' });
    // const [currentURL,setcurrentURL] = useState('');
    // const [currentPage, setCurrentPage] = useState(1);
    const config: AxiosRequestConfig = {
        params: {},
        withCredentials: true,
    };


    const { currentURL,currentPage,updateContext } = useContext(AppContext);

    
    // const sortParams = "breed:asc";

    //update code to check what params are passed and add them to params object
    

    const getBreeds = async () => {
        try {
            const response = await axios.get(`${baseUrl}/dogs/breeds`, { withCredentials: true });
            // console.log(response.data); // Handle the response data
            setBreeds(response.data);   
        } catch (error) {
            console.error(error);
        }
    };

    const getDogIDs = async () => {
        try {
        // console.log(`${sort.option}:${sort.order}`);
        config.params.sort = `${sort.option}:${sort.order}`;

        //   console.log(config);
         //get data frpm context to pass to API
          let response;

        //   console.log(currentURL);

          if(currentURL.length > 0){
            response = await axios.get(`${currentURL}`, { withCredentials: true });
            // console.log(response.data);
          }
          else{
            response = await axios.get(`${baseUrl}/dogs/search`, config);
          }
         

          
          //const response = await axios.get(`${baseUrl}/dogs/search`, config);
          const resultIds = response?.data?.resultIds || [];
          const next = response?.data?.next;
          const prev = response?.data?.prev;
          const total = response?.data?.total;
      
        //   console.log(response.data); // Handle the response data
          setDogIDs(resultIds);
          setnextIDs(next);
          setprevIDs(prev);
          settotalPages(Math.ceil(total/25));

          if(resultIds.length === 0){
            setDogs({});
            updateContext({currentPage : 0});
          }
      
          return resultIds;
        } catch (error) {
          console.error(error);
          throw error; // Re-throw the error to be handled externally
        }
      };
      
      const getDogInfo = async (resultIds: string[]) => {
        try {
        //   console.log(resultIds);
          const response = await axios.post(`${baseUrl}/dogs`, resultIds, { withCredentials: true });
        //   console.log(response.data);
          setDogs((prevDogs) => ({ ...prevDogs, ...response.data }));
        } catch (error) {
          console.error(error);
        }
      };
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const resultIds = await getDogIDs();
            if (resultIds.length > 0) {
              await getDogInfo(resultIds);
            }
            await getBreeds();
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, []);
      
      

    const getPrevDogIDs = async () => {
        try {
            updateContext({currentURL: `${baseUrl}${prevIDs}`});
            const response = await axios.get(`${baseUrl}${prevIDs}`, { withCredentials: true });

            if(response.data.next!= undefined) {
                setnextIDs(response.data.next);
            }
            else{
                setnextIDs('');
            }

            if (response.data.prev != undefined) {
                // console.log(response.data.prev);
                setprevIDs(response.data.prev);
            }
            else{
                setprevIDs('');
            }

            setDogIDs(response.data.resultIds);
            await getDogInfo(response.data.resultIds);
            //handleReload();

            // setCurrentPage(currentPage - 1);
            updateContext({currentPage: currentPage - 1});
        
            
        } catch (error) {
            
        }
    };

    const getNextDogIDs  = async () => {
        try {
            // console.log(nextIDs);
            // console.log(`${baseUrl}${nextIDs}`);
            // setcurrentURL(`${baseUrl}${nextIDs}`);
            updateContext({currentURL: `${baseUrl}${nextIDs}`});
            const response = await axios.get(`${baseUrl}${nextIDs}`, { withCredentials: true });
            // console.log(response.data);

            if(response.data.next!= undefined) {
                setnextIDs(response.data.next);
            }
            else{
                setnextIDs('');
            }

            if (response.data.prev != undefined) {
                // console.log(response.data.prev);
                setprevIDs(response.data.prev);
            }
            else{
                setprevIDs('');
            }

            setDogIDs(response.data.resultIds);
            //console.log(response.data.resultIds);
            await getDogInfo(response.data.resultIds);

            // handleReload();

            // setCurrentPage(currentPage + 1);
            updateContext({currentPage: currentPage + 1});
        
            
        } catch (error) {
            
        }
    };

    

    const CreateFilters = () => {
        const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
        const [ageMin, setAgeMin] = useState<number>(0);
        const [ageMax, setAgeMax] = useState<number>(0);

        const handleBreedsSelect = (selectedBreeds: string[]) => {
            setSelectedBreeds(selectedBreeds);
        };

        const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAgeMin(parseInt(e.target.value, 10));
        };
        
        const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setAgeMax(parseInt(e.target.value, 10));
        };

        const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSort({ ...sort, option: e.target.value });
        };
        
        const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSort({ ...sort, order: e.target.value });
        };
        
        
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            try {
              e.preventDefault();
          
              if (selectedBreeds && selectedBreeds.length > 0) {
                config.params.breeds = selectedBreeds;
              }
          
              if (ageMin && ageMin > 0) {
                config.params.ageMin = ageMin;
              }
              if (ageMax && ageMax > 0) {
                config.params.ageMax = ageMax;
              }

              config.params.sort = `${sort.option}:${sort.order}`;

              updateContext({currentURL: ''});
              updateContext({currentPage: 1});

              console.log(config);
          
              const resultIds = await getDogIDs();
              if (resultIds.length > 0) {
                await getDogInfo(resultIds);
              }
            
              setSelectedBreeds([]);
              setAgeMin(0);
              setAgeMax(0);
            //   setCurrentPage(1);
              setSort({ option: 'breed', order: 'asc' });
            //   window.location.reload();
            //   handleReload();
              //console.log("Successfully Applied");
            } catch (error) {
              console.error(error); // Handle error cases
            }
        };
          

        return (
            <div className="parent-div">
              <h4 className="font-color">Apply filters</h4>
          
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="font-color label">
                    Select Breeds:
                    <Dropdown options={breeds} onSelect={handleBreedsSelect} />
                  </label>
                </div>
          
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label font-color">Age Min:</label>
                    <div className="col-sm-4">
                        <input type="number" name="ageMin" value={isNaN(ageMin)? 0: ageMin} onChange={handleAgeMinChange} className="form-control" min="0" />
                    </div>

                    <label className="col-sm-2 col-form-label font-color">Age Max:</label>
                    <div className="col-sm-4">
                        <input type="number" name="ageMax" value={isNaN(ageMax)? 0: ageMax} onChange={handleAgeMaxChange} className="form-control" min="0" />
                    </div>
                </div>

        
                <div className="form-group">
                  <label className="font-color label">
                    Sort Option:
                    <select className="select" value={sort.option} onChange={handleSortOptionChange}>
                      <option value="name">Name</option>
                      <option value="breed">Breed</option>
                      <option value="age">Age</option>
                    </select>
                  </label>
          
                  <label className="font-color label">
                    Sort Order:
                    <select className="select" value={sort.order} onChange={handleSortOrderChange}>
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </label>
                </div>
          
                <button type="submit" className="btn btn-primary">Apply Filters</button>
              </form>
            </div>
          );
          
    };
    //create pagination component
    return (
        <div className="mt-4">
            <h1 className="text-center font-color" id='landing'>Landing Page</h1>
            <CreateFilters />
            <DogTable dogs={dogs} />
            <div className="pagination"  hidden={totalPages == 0}>
                <Button variant="primary" onClick={getPrevDogIDs} disabled={!prevIDs || prevIDs.length === 0}>Prev</Button>
                {currentPage > 1 && (
                    <Button variant="primary" className='pageNumber' disabled={true}>
                    {currentPage - 1}
                    </Button>
                )}
                <Button variant="primary" className="active pageNumber" >
                    {currentPage}
                </Button>
                {nextIDs && nextIDs.length > 0 && currentPage<totalPages && (
                    <Button variant="primary" className='pageNumber' disabled={true}>
                    {currentPage + 1}
                    </Button>
                )}
                <Button variant="primary" onClick={getNextDogIDs} disabled={!nextIDs || nextIDs.length === 0 || currentPage === totalPages}>Next</Button>
            </div>
            <p className="text-center font-color" hidden={totalPages == 0}>
                Showing {currentPage} / {totalPages}
            </p>
        </div>
    );
      
};