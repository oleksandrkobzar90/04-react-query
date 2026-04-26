import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import type { Movie } from "../../types/movie.ts";
import { fetchMovies } from "../../services/movieService.ts";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const totalPages = data?.total_pages ?? 0;

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111",
            color: "#fff",
          },
        }}
      />
      <SearchBar onSubmit={handleSearch} />
      <p>
        Current page {currentPage} | Total pages {totalPages}
      </p>
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={openModal} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
