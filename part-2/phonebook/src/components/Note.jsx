// Renders a single person row with a delete button.
const Note = ({ person, onDelete }) => (
  <div>
    {person.name} {person.number}{" "}
    {/* Sends the whole person back so the parent can confirm/delete. */}
    <button type="button" onClick={() => onDelete(person)}>
      delete
    </button>
  </div>
);

export default Note;
