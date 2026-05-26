import { useField, useAnecdotes } from "../hooks";
import { useNavigate } from "react-router-dom";

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes();
  const navigate = useNavigate();

  const content = useField("text");
  const author = useField("text");
  const info = useField("text");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });

    content.reset();
    author.reset();
    info.reset();

    navigate("/");
  };

  const handleReset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputProps} />
        </div>
        <div>
          author
          <input {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input {...info.inputProps} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
