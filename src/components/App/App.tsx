import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import fetchSearch from "../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";

function App() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
     
    const {isError, isLoading, data } = useQuery({
        queryKey: ['query', query, page],
        queryFn: () => getFetchSearch(query, page),
        enabled: !!query,
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
        {data?.total_pages&&!!data.results.length&& <ReactPaginate
        pageCount={data?.total_pages??0}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
        />}
        
        {isLoading && <Loader />}
        {isError&& <ErrorMessage/>}
        {data?.results&& <MovieGrid onSelect={()=>{}} movies={data.results}/>}
        <Toaster/>
    </>;
};

export default App;