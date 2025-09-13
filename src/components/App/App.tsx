import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import fetchSearch from "../../services/movieServices";
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
    const [movie, setMovie] = useState<Movie|null>();
     
    const {isError, isLoading, data, isSuccess } = useQuery({
        queryKey: ['query', query, page],
        queryFn: () => getFetchSearch(query, page),
        enabled: !!query,
        placeholderData: keepPreviousData
    });

    const getFetchSearch = async(query: string, page: number) => {
        try {
            const responce = await fetchSearch(query, page);
            if (!responce.results.length) toast.error("No movies found for your request.");
            return responce;
        } catch {
            toast.error("No movies found for your request.");
        }
        
    }


    const handleSearchSubmit = async (query: string) => {
        setQuery(query);
    }
    
    
    return <>
        <SearchBar onSubmit={handleSearchSubmit}/>
        {!isSuccess&&data?.total_results&& <ReactPaginate
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