import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import fetchSearch from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";


function App() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [movie, setMovie] = useState<Movie|null>(null);
    
    const getFetchSearch = async (query: string, page: number) => {
        
        const responce = await fetchSearch(query, page);
        return responce;
    };
     
    const {isError, isLoading, data, isSuccess } = useQuery({
        queryKey: ['query', query, page],
        queryFn: () => getFetchSearch(query, page),
        enabled: !!query,
        placeholderData: keepPreviousData
    });


    useEffect(() => {
        if (isSuccess && data && data?.results.length === 0) {
            toast.error("No movies found for your request.");
        }
        if (isError) {
             toast.error("No movies found for your request.");
        }

        
    }, [isSuccess, isError, data]);


    const handleSearchSubmit = async (query: string) => {
        setQuery(query);
        setPage(1);
    }
    
    
    return <>
        <SearchBar onSubmit={handleSearchSubmit}/>
        {isSuccess&& <ReactPaginate
        pageCount={data?.total_pages??0}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        renderOnZeroPageCount={null}
        />}
        
        {isLoading && <Loader />}
        {isError&& <ErrorMessage/>}
        {data?.results && <MovieGrid onSelect={(movie: Movie) => { setMovie(movie) }} movies={data.results} />}
        {!!movie&&<MovieModal movie={movie} onClose={()=>{ setMovie(null)} }/>}
        <Toaster/>
    </>;
};

export default App;