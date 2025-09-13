import axios from "axios";
import type { Movie } from "../../types/movie";

axios.defaults.baseURL = "https://api.themoviedb.org/3/";

interface FetchSearchProps {
    page: number,
results: Movie[],
total_pages: number,
total_results: number
}


const fetchSearch = async (query: string , page: number): Promise<FetchSearchProps> => {
   
    
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        },
        params: {
        query: query,
        page: page,
        include_adult: false,
        language: "en-US",
      }
  
};
    const response = await axios.get<FetchSearchProps>(`search/movie`, options);
    
    return response.data;
}

export default fetchSearch;