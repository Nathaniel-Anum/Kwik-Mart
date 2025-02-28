import axios from 'axios';

const API_URL = 'http://167.172.59.58/api/categories';

export const fetchCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data; // Ensure your API response is in this format
};
