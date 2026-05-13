import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../services/anecdotes.js";
import { useNotify } from "../contexts/NotificationContext.jsx";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notify = useNotify();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`New anecdote created: "${newAnecdote.content}"`);
    },
    onError: (error) => {
      let errorMessage = "Failed to create anecdote";

      if (error.response?.status === 400) {
        errorMessage = "Too short anecdote, must have length 5 or more";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error while creating anecdote";
      } else if (error.message) {
        errorMessage = error.message;
      }

      notify(errorMessage);
      console.error("Error creating anecdote:", error);
    },
  });

  const handleSubmition = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value.trim();
    if (content.length < 5) {
      notify("Too short anecdote, must have length 5 or more");
      return;
    }
    newAnecdoteMutation.mutate(content);
    event.target.anecdote.value = "";
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmition}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit" disabled={newAnecdoteMutation.isPending}>
          {newAnecdoteMutation.isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
