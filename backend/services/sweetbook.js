const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api-sandbox.sweetbook.com/v1';
const API_KEY = process.env.SWEETBOOK_API_KEY;

const sweetbookApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * 스위트북 API 연동 서비스
 */
class SweetbookService {
  // 1. 판형 목록 조회
  async getBookSpecs() {
    const response = await sweetbookApi.get('/book-specs');
    return response.data;
  }

  // 2. 템플릿 목록 조회
  async getTemplates(bookSpecUid, templateKind) {
    const response = await sweetbookApi.get('/templates', {
      params: { bookSpecUid, templateKind }
    });
    return response.data;
  }

  // 3. 책 생성 (Draft)
  async createBook(title, bookSpecUid) {
    const response = await sweetbookApi.post('/books', {
      title,
      bookSpecUid
    });
    return response.data.data; // { bookUid: "..." }
  }

  // 4. 표지 추가
  async addCover(bookUid, templateUid, parameters) {
    // multipart/form-data가 권장되나, JSON parameters로도 가능 (URL 방식 등)
    const response = await sweetbookApi.post(`/books/${bookUid}/cover`, {
      templateUid,
      parameters
    });
    return response.data;
  }

  // 5. 내지 추가
  async addContent(bookUid, templateUid, parameters, breakBefore = 'page') {
    const response = await sweetbookApi.post(`/books/${bookUid}/contents`, {
      templateUid,
      parameters
    }, {
      params: { breakBefore }
    });
    return response.data;
  }

  // 6. 최종화
  async finalizeBook(bookUid) {
    const response = await sweetbookApi.post(`/books/${bookUid}/finalization`);
    return response.data;
  }

  /**
   * 전체 자동 생성 워크플로우 (Scenario B)
   */
  async createFullMilitaryDiary(diaryData) {
    try {
      // 1. 책 생성 (기본 판형: A4 소프트커버 예시)
      const bookSpecUid = 'PHOTOBOOK_A4_SC';
      const { bookUid } = await this.createBook(diaryData.title, bookSpecUid);
      console.log(`Book created: ${bookUid}`);

      // 2. 표지 추가 (테스트용 템플릿 사용)
      await this.addCover(bookUid, 'tpl_F8d15af9fd', {
        title: diaryData.title,
        author: '대한민국 육군'
      });
      console.log('Cover added');

      // 3. 내지 추가 (에피소드 순회)
      for (const episode of diaryData.episodes) {
        await this.addContent(bookUid, '5iwCNE0Xa8Gb', {
          dateStr: episode.date,
          contents: episode.content,
          title: episode.title
        });
        console.log(`Content added: ${episode.title}`);
      }

      // 4. 최종화
      const finalResult = await this.finalizeBook(bookUid);
      console.log('Book finalized');

      return { bookUid, ...finalResult };
    } catch (error) {
      console.error('Full Workflow Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new SweetbookService();
