const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 스위트북 API 연동 라우트
app.post('/api/books', async (req, res) => {
  try {
    const { title, template_id, pages } = req.body;
    const response = await axios.post('https://api.sweetbook.com/v1/books', {
      title,
      template_id,
      pages
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SWEETBOOK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Sweetbook API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
