import { useEffect, useRef, useState } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import "./App.css";

const App = () => {
  // Holds all people in the phonebook list.
  const [persons, setPersons] = useState([]);

  // Holds the value typed in the name input field.
  const [newName, setNewName] = useState("");
  // Holds the value typed in the number input field.
  const [newNumber, setNewNumber] = useState("");
  // Holds the current search term for filtering.
  const [searchTerm, setSearchTerm] = useState("");
  // Holds the current notification message and type.
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    // Load initial data from the backend once when the app mounts.
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        window.clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Shows a notification for a few seconds, then clears it.
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    if (notificationTimeoutRef.current) {
      window.clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification({ message: null, type: "success" });
    }, 4000);
  };

  // Updates name input state as the user types.
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // Updates number input state as the user types.
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Updates search term state as the user types.
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Adds a new person when the form is submitted.
  const addPerson = (event) => {
    event.preventDefault();

    // Check if the name already exists.
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      // Ask before overwriting the old number for an existing name.
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (!ok) {
        return;
      }

      // Keep the original person data but update only the number.
      const updatedPerson = { ...existingPerson, number: newNumber };

      personService
        .update(existingPerson.id, updatedPerson)
        .then((savedPerson) => {
          // Replace the updated person in the local state list.
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === savedPerson.id ? savedPerson : person
            )
          );
          setNewName("");
          setNewNumber("");
          showNotification(`Updated ${savedPerson.name}`);
        })
        .catch((error) => {
          const status = error?.response?.status;
          if (status === 404) {
            // If the server says "not found", remove the stale person locally.
            setPersons((prevPersons) =>
              prevPersons.filter((person) => person.id !== existingPerson.id)
            );
            showNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              "error"
            );
          } else {
            showNotification(
              `Failed to update ${existingPerson.name}.`,
              "error"
            );
          }
        });

      return;
    }

    // Create a brand-new person when the name is not found.
    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then((savedPerson) => {
        // Add the saved person (with server-generated id) to local state.
        setPersons((prevPersons) => prevPersons.concat(savedPerson));
        setNewName("");
        setNewNumber("");
        setErrorMessage(null);
        showNotification(`Added ${savedPerson.name}`);
      })
      .catch((error) => {
        const backendMessage = error?.response?.data?.error;
        setErrorMessage(
          backendMessage || `Failed to add ${personObject.name}.`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  // Deletes a person after the user confirms the action.
  const handleDelete = (person) => {
    const ok = window.confirm(`Delete ${person.name}?`);
    if (!ok) {
      return;
    }

    personService
      .remove(person.id)
      .then(() => {
        // Remove the deleted person from local state.
        setPersons((prevPersons) =>
          prevPersons.filter((item) => item.id !== person.id)
        );
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 404) {
          setPersons((prevPersons) =>
            prevPersons.filter((item) => item.id !== person.id)
          );
          showNotification(
            `Information of ${person.name} has already been removed from server`,
            "error"
          );
        } else {
          showNotification(`Failed to delete ${person.name}.`, "error");
        }
      });
  };

  // Creates the list to show based on the current search term.
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        type={notification.type}
      />
      <Filter value={searchTerm} onChange={handleSearchChange} />

      {errorMessage && <div className="error">{errorMessage}</div>}

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDelete} />
    </div>
  );
};

export default App;
