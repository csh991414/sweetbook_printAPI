const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api-sandbox.sweetbook.com/v1';
const API_KEY = process.env.SWEETBOOK_API_KEY;

/**
 * Sweetbook API Client for direct communication
 */
const sweetbookApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error logging
sweetbookApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('--- Sweetbook API Error ---');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    console.error('---------------------------');
    return Promise.reject(error);
  }
);

module.exports = sweetbookApi;
