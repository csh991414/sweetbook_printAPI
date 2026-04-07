const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sweetbookService = require('./services/sweetbook');

const app = express();
app.use(express.json());
app.use(cors());

// 1. 판형 목록 조회
app.get('/api/book-specs', async (req, res) => {
  try {
    const specs = await sweetbookService.getBookSpecs();
    res.json(specs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 전체 자동 생성 워크플로우 실행
app.post('/api/books/auto-generate', async (req, res) => {
  try {
    const { title, episodes } = req.body;
    const result = await sweetbookService.createFullMilitaryDiary({ title, episodes });
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate military diary book',
      details: error.response?.data || error.message 
    });
  }
});

// 3. 기존 개별 API 연동 (단순 프록시 예시)
app.post('/api/books', async (req, res) => {
  try {
    const { title, bookSpecUid } = req.body;
    const result = await sweetbookService.createBook(title, bookSpecUid || 'PHOTOBOOK_A4_SC');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
