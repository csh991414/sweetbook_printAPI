const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sweetbookService = require('./services/sweetbook');
const db = require('./services/database');

const app = express();
app.use(express.json({ limit: '50mb' })); // Increase limit for local images
app.use(cors());

// 1. 전체 책 목록 조회 (Local DB + API Sync)
app.get('/api/books', async (req, res) => {
  try {
    const localBooks = await db.all('SELECT * FROM books ORDER BY createdAt DESC');
    res.json(localBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 책 생성 (Draft + Local DB)
app.post('/api/books', async (req, res) => {
  try {
    const { title, bookSpecUid } = req.body;
    // 1. API로 책 생성
    const result = await sweetbookService.createBook(title, bookSpecUid || 'PHOTOBOOK_A4_SC');
    
    // 2. 로컬 DB에 저장
    await db.run(
      'INSERT INTO books (bookUid, title, description) VALUES (?, ?, ?)',
      [result.bookUid, title, '사용자 생성 이야기']
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. 책 상세 및 페이지 목록 조회
app.get('/api/books/:bookUid/contents', async (req, res) => {
  try {
    const contents = await sweetbookService.getBookContents(req.params.bookUid);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. 페이지 추가 (API)
app.post('/api/books/:bookUid/contents', async (req, res) => {
  try {
    const { templateUid, parameters } = req.body;
    const result = await sweetbookService.addContent(req.params.bookUid, templateUid, parameters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. 페이지 삭제 (API)
app.delete('/api/books/:bookUid/contents/:contentUid', async (req, res) => {
  try {
    const result = await sweetbookService.deleteContent(req.params.bookUid, req.params.contentUid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. 주문 생성 (Orders API)
app.post('/api/books/:bookUid/orders', async (req, res) => {
  try {
    const result = await sweetbookService.createOrder(req.params.bookUid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
