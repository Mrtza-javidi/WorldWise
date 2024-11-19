import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  // useState,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch-cities":
      return { ...state, isLoading: false, cities: action.payload };

    case "get-city":
      return { ...state, currentCity: action.payload };

    case "create-city":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "delete-city":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "loading":
      return { ...state, isLoading: true };

    case "finish-loading":
      return { ...state, isLoading: false };

    case "error":
      return { ...state, error: action.payload };

    default:
      throw new Error("action is unavailable");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "fetch-cities", payload: data });
        // setCities(data);
      } catch (error) {
        dispatch({
          type: "error",
          payload: "There was an error fetching cities!",
        });
        // throw new Error(error.message);
      } finally {
        dispatch({ type: "finish-loading" });
        // setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (id === currentCity.id) return;

      try {
        dispatch({ type: "loading" });
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "get-city", payload: data });
        // setCurrentCity(data);
      } catch (error) {
        dispatch({
          type: "error",
          payload: "There was an error getting the city!",
        });
        // throw new Error(error.message);
      } finally {
        dispatch({ type: "finish-loading" });
        // setIsLoading(false);
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "create-city", payload: data });
      // setCities((cities) => [...cities, data]);
    } catch (error) {
      dispatch({
        type: "error",
        payload: "There was an error creating the new city!",
      });
      // throw new Error(error.message);
    } finally {
      dispatch({ type: "finish-loading" });
      // setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "delete-city", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      dispatch({
        type: "error",
        payload: "There was an error deleting the city!",
      });
      // alert("There was an error deleting city.");
    } finally {
      dispatch({ type: "finish-loading" });
      // setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
