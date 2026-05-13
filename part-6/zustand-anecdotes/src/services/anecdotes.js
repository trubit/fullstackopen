const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }
  return response.json();
};

export const createAnecdote = async (content) => {
  const newAnecdote = {
    content,
    votes: 0,
  };
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAnecdote),
  });
  if (!response.ok) {
    const error = new Error("Failed to create anecdote");
    error.response = response;
    throw error;
  }
  return response.json();
};

export const voteAnecdote = async (anecdote) => {
  const updatatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatatedAnecdote),
  });
  if (!response.ok) {
    throw new Error("Failed to vote anecdote");
  }
  return response.json();
};

export const deleteAnecdote = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete anecdote");
  }
  return response.json();
};
