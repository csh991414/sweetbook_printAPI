const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sweetbookService = require('./services/sweetbook');
const db = require('./services/database');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// 1. 전체 책 목록 (Admin: All, User: Own)
app.get('/api/books', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'user_1';
    const localBooks = await db.all('SELECT * FROM books ORDER BY createdAt DESC');
    if (userId !== 'admin') {
      return res.json(localBooks.filter(b => b.userId === userId));
    }
    res.json(localBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 책 생성 (제한 해제)
app.post('/api/books', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'user_1';
    const { title, description, bookSpecUid } = req.body;
    
    const result = await sweetbookService.createBook(title, description, bookSpecUid || 'PHOTOBOOK_A4_SC');
    
    await db.run(
      'INSERT INTO books (bookUid, title, description, userId) VALUES (?, ?, ?, ?)',
      [result.bookUid, title, description || '', userId]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2-1. 자동 북 생성 (프론트엔드 전용)
app.post('/api/books/auto-generate', async (req, res) => {
  try {
    const { title, episodes } = req.body;
    const userId = req.headers['x-user-id'] || 'user_1';
    
    // 1. 도서 객체 생성
    const bookResult = await sweetbookService.createBook(title, '자동 생성된 도서', 'PHOTOBOOK_A4_SC');
    const bookUid = bookResult.bookUid;

    // 2. 에피소드들을 페이지로 변환하여 추가
    for (const ep of episodes) {
      // 템플릿 필수 파라미터 보정 (문서 예시 기반 최소화)
      const parameters = {
        date: ep.date || new Date().toISOString().split('T')[0],
        photo1: ep.image || 'https://picsum.photos/800/600',
        content: ep.content || '',
        title: ep.title || ''
      };

      // 문서 예시 templateUid: 4slyauW5rkUE 사용
      await sweetbookService.addContent(bookUid, '4slyauW5rkUE', parameters);
    }

    // 3. 로컬 DB 저장
    await db.run(
      'INSERT INTO books (bookUid, title, description, userId) VALUES (?, ?, ?, ?)',
      [bookUid, title, '자동 생성', userId]
    );

    res.json({ success: true, bookUid });
  } catch (error) {
    console.error('Auto Generate Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. 책 삭제 (추가된 기능)
app.delete('/api/books/:bookUid', async (req, res) => {
  try {
    const { bookUid } = req.params;
    // 로컬 DB에서 먼저 삭제 (API 서버 삭제는 별도 가이드 확인 필요하나 우선 로컬/목록에서 제거)
    const data = await db._read();
    data.books = data.books.filter(b => b.bookUid !== bookUid);
    await db._write(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. 페이지 조회
app.get('/api/books/:bookUid/contents', async (req, res) => {
  try {
    const contents = await sweetbookService.getBookContents(req.params.bookUid);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. 페이지 추가
app.post('/api/books/:bookUid/contents', async (req, res) => {
  try {
    const { templateUid, parameters } = req.body;
    const targetTemplate = templateUid || '5iwCNE0Xa8Gb'; 
    const result = await sweetbookService.addContent(req.params.bookUid, targetTemplate, parameters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. 페이지 수정
app.put('/api/books/:bookUid/contents/:contentUid', async (req, res) => {
  try {
    const { parameters } = req.body;
    const result = await sweetbookService.updateContent(req.params.bookUid, req.params.contentUid, parameters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. 페이지 삭제
app.delete('/api/books/:bookUid/contents/:contentUid', async (req, res) => {
  try {
    const result = await sweetbookService.deleteContent(req.params.bookUid, req.params.contentUid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. 주문 생성
app.post('/api/books/:bookUid/orders', async (req, res) => {
  try {
    const result = await sweetbookService.createOrder(req.params.bookUid, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
