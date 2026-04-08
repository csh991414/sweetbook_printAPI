const axios = require('axios');

async function testAutoGenerate() {
  console.log('--- Auto Generate API Test Start ---');
  
  const payload = {
    title: '나의 군 생활 기록',
    episodes: [
      {
        date: '2026-03-01',
        title: '입대하는 날',
        content: '드디어 입대했다. 날씨는 맑았고 기분은 묘했다.',
        image: 'https://picsum.photos/800/600',
        tag: '훈련'
      },
      {
        date: '2026-03-15',
        title: '첫 휴가',
        content: '100일 만에 나온 첫 휴가. 치킨이 너무 맛있다.',
        image: 'https://picsum.photos/801/601',
        tag: '휴가'
      }
    ]
  };

  try {
    const res = await axios.post('http://localhost:4001/api/books/auto-generate', payload);
    console.log('Success!', res.data);
  } catch (error) {
    console.error('Failed!', error.response ? error.response.data : error.message);
  }
}

testAutoGenerate();
