import { useFilter, useAnecdoteActions } from "../../store/store";

const Filter = () => {
  const filter = useFilter();
  const { setFilter } = useAnecdoteActions();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };

  return (
    <div style={style}>
      <label className="filter">Filter</label>
      <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
