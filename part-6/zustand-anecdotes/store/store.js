import { create } from "zustand";

// Helper function
const getId = () => (100000 * Math.random()).toFixed(0);

// Helper function
const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

// Store
const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",

  // Actions
  actions: {
    initializeAnecdotes: async () => {
      const response = await fetch("http://localhost:3001/anecdotes");
      const data = await response.json();
      set({ anecdotes: data.toSorted((a, b) => b.votes - a.votes) });
    },

    addAnecdote: async (content) => {
      const newAnecdote = {
        content,
        votes: 0,
      };

      const response = await fetch("http://localhost:3001/anecdotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnecdote),
      });
      const savedAnecdote = await response.json();

      set((state) => ({
        anecdotes: [...state.anecdotes, savedAnecdote].toSorted(
          (a, b) => b.votes - a.votes,
        ),
      }));
    },

    vote: async (id) => {
      const state = get();
      const existingAnecdote = state.anecdotes.find(
        (anecdote) => anecdote.id === id,
      );
      if (!existingAnecdote) return;

      const anecdoteToVote = {
        ...existingAnecdote,
        votes: existingAnecdote.votes + 1,
      };

      const response = await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anecdoteToVote),
      });

      const savedAnecdote = await response.json();

      set((currentState) => ({
        anecdotes: currentState.anecdotes
          .map((anecdote) => (anecdote.id === id ? savedAnecdote : anecdote))
          .toSorted((a, b) => b.votes - a.votes),
      }));

      setNotification(`You voted '${savedAnecdote.content}'`);
    },

    deleteAnecdote: async (id) => {
      const state = get();
      const existingAnecdote = state.anecdotes.find(
        (anecdote) => anecdote.id === id,
      );
      if (!existingAnecdote || existingAnecdote.votes !== 0) return;

      await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: "DELETE",
      });

      set((currentState) => ({
        anecdotes: currentState.anecdotes.filter(
          (anecdote) => anecdote.id !== id,
        ),
      }));

      setNotification(`Deleted anecdote '${existingAnecdote.content}'`);
    },

    // add to filter
    setFilter: (filterText) =>
      set({ filter: String(filterText ?? "").toLowerCase() }),
    /*resetFilter: () => set({ filter: "" }),*/
  },
}));

export { useAnecdoteStore };

// Hooks exportcle
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
