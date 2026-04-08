const sweetbookApi = require('./sweetbook-api');

/**
 * 스위트북 API 연동 서비스
 */
class SweetbookService {
  constructor() {
    if (!process.env.SWEETBOOK_API_KEY) {
      console.error('[CRITICAL ERROR] SWEETBOOK_API_KEY is missing in environment variables!');
    }
  }

  // 1. 판형 목록 조회
  async getBookSpecs() {
    try {
      const response = await sweetbookApi.get('/book-specs');
      return response.data;
    } catch (error) {
      console.error('Error fetching book-specs:', error.message);
      throw error;
    }
  }

  // 2. 템플릿 목록 조회
  async getTemplates(bookSpecUid, templateKind) {
    try {
      const response = await sweetbookApi.get('/templates', {
        params: { bookSpecUid, templateKind }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error.message);
      throw error;
    }
  }

  // 3. 책 생성 (Draft)
  async createBook(title, bookSpecUid) {
    try {
      console.log(`[Service] Creating book: "${title}" with spec: ${bookSpecUid}`);
      const response = await sweetbookApi.post('/books', {
        title,
        bookSpecUid
      });
      
      if (response.data && response.data.data) {
        return response.data.data; // { bookUid: "..." }
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('[Service] Failed to create book');
      throw error;
    }
  }

  // 4. 생성된 책 목록 조회 (과제용: 실제로는 유저별 관리가 필요하지만 여기선 목록 반환)
  async getBooks() {
    try {
      const response = await sweetbookApi.get('/books');
      return response.data.data; // [{ bookUid, title, ... }]
    } catch (error) {
      console.error('Error fetching books:', error.message);
      throw error;
    }
  }

  // 5. 책 상세 및 페이지(Contents) 조회
  async getBookContents(bookUid) {
    try {
      const response = await sweetbookApi.get(`/books/${bookUid}/contents`);
      return response.data.data; 
    } catch (error) {
      console.error('Error fetching contents:', error.message);
      throw error;
    }
  }

  // 6. 페이지 삭제
  async deleteContent(bookUid, contentUid) {
    try {
      const response = await sweetbookApi.delete(`/books/${bookUid}/contents/${contentUid}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting content:', error.message);
      throw error;
    }
  }

  // 7. 주문 생성 (필수 요구사항: Orders API)
  async createOrder(bookUid, orderData) {
    try {
      const response = await sweetbookApi.post('/orders', {
        bookUid,
        receiverName: orderData.receiverName || '홍길동',
        receiverZipcode: orderData.receiverZipcode || '12345',
        receiverAddress1: orderData.receiverAddress1 || '서울특별시 광진구 누구로 111',
        receiverAddress2: orderData.receiverAddress2 || '1층',
        receiverPhone: orderData.receiverPhone || '010-1234-5678'
      });
      return response.data.data;
    } catch (error) {
      console.error('Order API Error:', error.message);
      throw error;
    }
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
