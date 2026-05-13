import { useQuery } from "@tanstack/react-query";
import { getAnecdotes } from "../services/anecdotes.js";

export const useAnecdotesQuery = () => {
  return useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
