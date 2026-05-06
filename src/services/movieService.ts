import axios from "axios";
import type { Movie } from "../types/movie.ts";

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

const myToken = import.meta.env.VITE_TMDB_TOKEN;

axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.params = {
  include_adult: false,
  language: "en-US",
};

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MovieHttpResponse> => {
  const response = await axios.get<MovieHttpResponse>("/search/movie", {
    params: { query: String(query), page },
    headers: { Authorization: `Bearer ${myToken}` },
  });
  return response.data;
};
