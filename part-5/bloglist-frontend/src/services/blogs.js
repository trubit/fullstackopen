import axios from "axios";

// Service module for handling blog-related API calls
const baseUrl = "/api/blogs";
let token = null;

// Function to set the authentication token for API requests
const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null;
};

// Function to fetch all blogs from the API
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

// Function to create a new blog via the API
const create = async (newBlog) => {
  const config = token
    ? {
        headers: {
          Authorization: token,
        },
      }
    : {};

  // Ensure that the new blog includes user information if the token is set
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, updatedBlog) => {
  const config = token
    ? {
        headers: {
          Authorization: token,
        },
      }
    : {};

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

const remove = async (id) => {
  const config = token
    ? {
        headers: {
          Authorization: token,
        },
      }
    : {};

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, getById, create, update, remove, setToken };
