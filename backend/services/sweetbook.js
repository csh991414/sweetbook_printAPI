const sweetbookApi = require('./sweetbook-api');
const FormData = require('form-data');

class SweetbookService {
  logError(action, error) {
    console.error(`\n[!!! API ERROR] Action: ${action}`);
    if (error.response) {
      console.error(` - Status: ${error.response.status}`);
      console.error(` - Data: ${JSON.stringify(error.response.data)}`);
      console.error(` - Headers: ${JSON.stringify(error.response.headers)}`);
    } else {
      console.error(` - Message: ${error.message}`);
    }
  }

  // 1. 모든 도서 목록 (테스트용)
  async getBooks() {
    try {
      const res = await sweetbookApi.get('books');
      return res.data.data;
    } catch (e) { this.logError('getBooks', e); throw e; }
  }

  // 2. 도서 생성 (Create Book)
  async createBook(title, description, bookSpecUid) {
    try {
      const res = await sweetbookApi.post('books', {
        title,
        bookSpecUid: bookSpecUid || 'PHOTOBOOK_A4_SC'
      });
      return res.data.data;
    } catch (e) { this.logError('createBook', e); throw e; }
  }

  // 3. 도서 상세 조회
  async getBookDetails(bookUid) {
    try {
      const res = await sweetbookApi.get(`books/${bookUid}`);
      return res.data.data;
    } catch (e) { this.logError('getBookDetails', e); throw e; }
  }

  // 4. 콘텐츠(페이지) 추가/수정 (Add/Update Contents)
  // 문서: POST /books/{bookUid}/contents
  async addContent(bookUid, templateUid, parameters) {
    try {
      const form = new FormData();
      form.append('templateUid', templateUid);
      
      const refinedParams = { ...parameters };
      
      // 이미지 처리 로직
      if (parameters.imageUrl) {
        if (Array.isArray(parameters.imageUrl)) {
          // 갤러리 방식 (배열 URL)
          refinedParams.galleryPhotos = parameters.imageUrl;
          delete refinedParams.imageUrl;
        } else if (parameters.imageUrl.startsWith('data:')) {
          // 파일 업로드 방식 (Base64)
          const base64Data = parameters.imageUrl.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          form.append('photo1', buffer, { filename: 'upload.jpg', contentType: 'image/jpeg' });
          delete refinedParams.imageUrl;
        } else if (parameters.imageUrl.startsWith('http')) {
          // 단일 URL 방식
          refinedParams.photo1 = parameters.imageUrl;
          delete refinedParams.imageUrl;
        }
      }
      
      // parameters 필드에 JSON 문자열로 추가
      form.append('parameters', JSON.stringify(refinedParams));
      
      const res = await sweetbookApi.post(`books/${bookUid}/contents`, form, { 
        headers: form.getHeaders() 
      });
      
      return res.data.data;
    } catch (e) { this.logError('addContent', e); throw e; }
  }

  // 5. 페이지 수정 (문서 가이드에 따라 addContent와 동일한 Endpoint 사용)
  async updateContent(bookUid, contentUid, parameters) {
    // 문서에 따르면 동일 페이지에 다시 POST하면 "updated"가 됨.
    // 만약 특정 contentUid가 꼭 필요하다면 기존 로직을 유지하지만, 404가 나므로 addContent를 권장함.
    // 여기서는 안전하게 addContent 로직을 재사용하여 404를 방지합니다.
    return this.addContent(bookUid, parameters.templateUid || '5iwCNE0Xa8Gb', parameters);
  }

  // 6. 콘텐츠 삭제
  async deleteContent(bookUid, contentUid) {
    try {
      const res = await sweetbookApi.delete(`books/${bookUid}/contents/${contentUid}`);
      return res.data;
    } catch (e) { this.logError('deleteContent', e); throw e; }
  }

  // 7. 주문 생성
  async createOrder(bookUid, orderData) {
    try {
      const res = await sweetbookApi.post('orders', {
        bookUid,
        receiverName: orderData.receiverName || '테스트 유저',
        receiverZipcode: '12345',
        receiverAddress1: '서울특별시 광진구 누구로 111',
        receiverAddress2: '1층',
        receiverPhone: '010-1234-5678'
      });
      return res.data.data;
    } catch (e) { this.logError('createOrder', e); throw e; }
  }
}

module.exports = new SweetbookService();
