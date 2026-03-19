// Form for creating a new person entry.
const PersonForm = ({
  onSubmit,
  nameValue,
  onNameChange,
  numberValue,
  onNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      {/* Name input field */}
      name: <input value={nameValue} onChange={onNameChange} />
    </div>
    <div>
      {/* Phone number input field */}
      number: <input value={numberValue} onChange={onNumberChange} />
    </div>
    <div>
      {/* Submits the form */}
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
