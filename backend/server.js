import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// 1. 책 목록 (API Sync - 현재는 목업 데이터 반환)
app.get('/api/books', async (c) => {
  try {
    // Cloudflare D1 (c.env.DB) 연동 가능
    // 현재는 로컬 테스트를 위해 빈 배열 반환 또는 더미 데이터
    const localBooks = [
      { id: 1, bookUid: "DUMMY_BOOK", title: "소나기 (로컬)", description: "홍길동 병장의 일기", createdAt: new Date().toISOString() }
    ];
    return c.json(localBooks);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 2. 책 생성 (Draft)
app.post('/api/books', async (c) => {
  const { title, bookSpecUid } = await c.req.json();
  try {
    // API Key는 c.env.SWEETBOOK_API_KEY에서 가져옴
    const API_KEY = c.env.SWEETBOOK_API_KEY;
    const response = await fetch('https://api-sandbox.sweetbook.com/v1/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, bookSpecUid: bookSpecUid || 'PHOTOBOOK_A4_SC' })
    });
    const result = await response.json();
    return c.json(result.data);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 3. 책 상세 조회
app.get('/api/books/:bookUid/contents', async (c) => {
  const bookUid = c.req.param('bookUid');
  const API_KEY = c.env.SWEETBOOK_API_KEY;
  try {
    const response = await fetch(`https://api-sandbox.sweetbook.com/v1/books/${bookUid}/contents`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const result = await response.json();
    return c.json(result.data);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 4. 페이지 삭제
app.delete('/api/books/:bookUid/contents/:contentUid', async (c) => {
  const { bookUid, contentUid } = c.req.param();
  const API_KEY = c.env.SWEETBOOK_API_KEY;
  try {
    const response = await fetch(`https://api-sandbox.sweetbook.com/v1/books/${bookUid}/contents/${contentUid}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 5. 주문 생성
app.post('/api/books/:bookUid/orders', async (c) => {
  const bookUid = c.req.param('bookUid');
  const body = await c.req.json();
  const API_KEY = c.env.SWEETBOOK_API_KEY;
  try {
    const response = await fetch(`https://api-sandbox.sweetbook.com/v1/books/${bookUid}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default app
