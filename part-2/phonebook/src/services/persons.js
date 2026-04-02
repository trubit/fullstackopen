import axios from "axios";

// Base URL for the backend API.
const baseUrl = "/api/persons";

// Fetch all persons from the backend.
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.persons)) {
      return data.persons;
    }
    return [];
  });
};

// Create a new person in the backend.
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => {
    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    if (data?.person) {
      return data.person;
    }
    return data;
  });
};

// Update an existing person by id in the backend.
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => {
    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    if (data?.person) {
      return data.person;
    }
    return data;
  });
};

// Delete a person by id from the backend.
const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => {
    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    return data;
  });
};

export default { getAll, create, update, remove };
