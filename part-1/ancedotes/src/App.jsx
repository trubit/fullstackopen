import { useState } from "react";

const App = () => {
  // List of anecdote texts shown in the app.
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  // Index of the currently displayed anecdote.
  const [selected, setSelected] = useState(0);
  // Vote counts for each anecdote, aligned by index with `anecdotes`.
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  // Increment the vote count for the currently selected anecdote.
  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  // Pick a random anecdote index and display it.
  const getRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  // Find the index of the anecdote with the most votes.
  // If there is a tie, `indexOf` returns the first one.
  const maxVotes = Math.max(...votes);
  const mostVotedIndex = votes.indexOf(maxVotes);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {/* Show the currently selected anecdote and its votes */}
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      {/* Actions: vote for current anecdote or show a new random one */}
      <button onClick={handleVote}>vote</button>
      <button onClick={getRandomAnecdote}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {/* Show the anecdote that has the highest vote count */}
      <p>{anecdotes[mostVotedIndex]}</p>
      <p>has {maxVotes} votes</p>
    </div>
  );
};

export default App;
