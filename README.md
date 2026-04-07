# 스마트 병영일기: 소나기 리부트

## 1. 서비스 소개
'스마트 병영일기: 소나기 리부트'는 군 생활의 소중한 기억들을 타임라인 형식으로 기록하고, 이를 실제 포토북으로 제작할 수 있도록 돕는 서비스입니다. 훈련소 입소부터 전역까지의 주요 에피소드를 시각화하여 관리할 수 있습니다.

## 2. 실행 방법

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 3. 사용한 API 목록
- **Sweetbook Print API (v1)**: 기록된 에피소드들을 바탕으로 포토북 제작 및 주문 연동을 위해 사용되었습니다.
  - `POST /v1/books`: 도서 생성 및 데이터 전송

## 4. AI 도구 사용 내역
- **Gemini CLI**: 프로젝트 초기 뼈대 구성, Vue 3 타임라인 UI 컴포넌트 작성, Express 백엔드 API 연동 로직 구현 및 전체 프로젝트 구조 최적화에 활용되었습니다.
