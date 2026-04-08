const sweetbookService = require('./services/sweetbook');

async function test() {
  console.log('--- Sweetbook API Test Start ---');
  
  try {
    // 1. 도서 생성 테스트
    console.log('\nStep 1: Creating a book...');
    const book = await sweetbookService.createBook('테스트 도서', '테스트 설명', 'PHOTOBOOK_A4_SC');
    console.log('Book Created:', book.bookUid);
    
    // 2. 콘텐츠 추가 테스트 (URL 방식)
    console.log('\nStep 2: Adding content (URL style)...');
    const content = await sweetbookService.addContent(book.bookUid, '4slyauW5rkUE', {
      date: '2026-04-08',
      photo1: 'https://picsum.photos/800/600'
    });
    console.log('Content Added:', content);
    
    // 3. 콘텐츠 추가 테스트 (갤러리 방식)
    console.log('\nStep 3: Adding gallery content...');
    const galleryContent = await sweetbookService.addContent(book.bookUid, '4slyauW5rkUE', {
      date: '2026-04-08',
      imageUrl: ['https://picsum.photos/800/600', 'https://picsum.photos/801/601']
    });
    console.log('Gallery Content Added:', galleryContent);
    
    console.log('\n--- Test Completed Successfully ---');
  } catch (error) {
    console.error('\n--- Test Failed ---');
    // 에러 상세 정보는 서비스 내부 로거에서 출력됨
  }
}

test();
