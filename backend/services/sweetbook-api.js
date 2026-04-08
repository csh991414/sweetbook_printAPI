const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api-sandbox.sweetbook.com/v1/';
const API_KEY = process.env.SWEETBOOK_API_KEY;

const sweetbookApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json'
  }
});

// 모든 요청의 실제 URL을 터미널에 출력하는 인터셉터 추가
sweetbookApi.interceptors.request.use(config => {
  const fullUrl = `${config.baseURL}${config.url.startsWith('/') ? config.url.substring(1) : config.url}`;
  console.log(`\n[Outgoing Request] ${config.method.toUpperCase()} ${fullUrl}`);
  return config;
});

module.exports = sweetbookApi;
