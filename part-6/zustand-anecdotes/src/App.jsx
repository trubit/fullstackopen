import { useAnecdoteActions } from "../store/store.js";
import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteLis.jsx";
import Filter from "./components/Filter.jsx";
import Notification from "./components/Notification.jsx";
import { useAnecdotesQuery } from "./hooks/useAnecdotesQuery.js";

const App = () => {
  const result = useAnecdotesQuery();

  if (result.isPending) {
    return <div>Loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      <Notification />
      <Filter />
      <AnecdoteList anecdotes={result.data} />
      <AnecdoteForm />
    </div>
  );
};

export default App;
