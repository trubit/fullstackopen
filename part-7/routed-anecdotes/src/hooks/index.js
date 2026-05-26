import { useEffect, useState } from "react";
import anecdotesService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,

    inputProps: {
      type,
      value,
      onChange,
    },
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    anecdotesService
      .getAll()
      .then((data) => {
        setAnecdotes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch anecdotes:", error);
        setIsLoading(false);
      });
  }, []);

  const addAnecdote = async (newAnecdote) => {
    const createdAnecdote = await anecdotesService.create(newAnecdote);
    setAnecdotes((current) => current.concat(createdAnecdote));
  };

  const deleteAnecdote = async (id) => {
    await anecdotesService.remove(id);
    setAnecdotes((current) => current.filter((anecdote) => anecdote.id !== id));
  };

  return {
    anecdotes,
    isLoading,
    addAnecdote,
    deleteAnecdote,
  };
};
