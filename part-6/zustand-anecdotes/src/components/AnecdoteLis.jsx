import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteAnecdote, deleteAnecdote } from "../services/anecdotes";
import { useNotify } from "../contexts/NotificationContext";
import { useFilter } from "../../store/store";

const AnecdoteList = ({ anecdotes }) => {
  const queryClient = useQueryClient();
  const notify = useNotify();
  const filter = useFilter();

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`You voted for "${updatedAnecdote.content}"`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify("Anecdote deleted");
    },
  });

  const filteredAnecdotes = anecdotes
    .filter((anecdote) => anecdote.content.toLowerCase().includes(filter))
    .sort((a, b) => b.votes - a.votes);

  return (
    <div>
      {filteredAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => voteMutation.mutate(anecdote)}
              disabled={voteMutation.isPending}
            >
              vote
            </button>
            {anecdote.votes === 0 && (
              <button
                onClick={() => deleteMutation.mutate(anecdote.id)}
                disabled={deleteMutation.isPending}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
