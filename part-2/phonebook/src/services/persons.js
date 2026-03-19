import axios from "axios";

// Base URL for the persons resource in the backend.
const baseUrl = "http://localhost:3001/persons";

// Fetch all persons from the backend.
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// Create a new person in the backend.
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

// Update an existing person by id in the backend.
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

// Delete a person by id from the backend.
const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, remove };
