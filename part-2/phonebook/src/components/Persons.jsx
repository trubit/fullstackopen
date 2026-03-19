import Note from "./Note";

// Renders the list of persons using the Note component.
const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map((person) => (
      <Note key={person.id} person={person} onDelete={onDelete} />
    ))}
  </div>
);

export default Persons;
