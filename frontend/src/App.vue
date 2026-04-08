<template>
  <div class="min-h-screen bg-[#F5F5F5] flex flex-col font-sans text-gray-800 print:bg-white">
    <!-- Top Navigation -->
    <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-sm print:hidden">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2 cursor-pointer" @click="goHome">
          <span class="text-2xl font-black text-indigo-600">AI</span>
          <span class="text-xl font-bold tracking-tighter text-gray-900">STORYCLASS</span>
        </div>
        <div class="h-6 w-px bg-gray-200"></div>
        <div class="flex items-center"><span class="text-sm font-bold text-gray-400">SONAKI</span></div>
      </div>
      
      <div class="hidden md:flex items-center space-x-8">
        <div class="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
           <button @click="userRole = 'user_1'" :class="['px-4 py-1.5 text-[10px] font-black rounded-full transition', userRole === 'user_1' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400']">USER</button>
           <button @click="userRole = 'admin'" :class="['px-4 py-1.5 text-[10px] font-black rounded-full transition', userRole === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400']">ADMIN</button>
        </div>
        <nav class="flex space-x-6 text-[13px] font-bold text-gray-500">
          <button @click="currentView = 'MY BOOK'; selectedBookForViewer = null" :class="['hover:text-indigo-600 transition uppercase', currentView === 'MY BOOK' ? 'text-indigo-600 underline underline-offset-8' : '']">내 이야기</button>
          <button @click="currentView = 'ADD/EDIT'" :class="['hover:text-indigo-600 transition uppercase', currentView === 'ADD/EDIT' ? 'text-indigo-600 underline underline-offset-8' : '']">페이지 수정/추가/삭제</button>
        </nav>
        <button @click="handleCreateNewBook" class="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 shadow-lg transition">새 책 생성</button>
      </div>
    </header>

    <main v-if="currentView === 'MY BOOK'" class="flex-grow flex flex-col items-center py-12 px-6 print:py-0 print:px-0">
      <template v-if="selectedBookForViewer">
        <div class="w-full max-w-screen-xl flex flex-col items-center">
          <button @click="selectedBookForViewer = null" class="self-start mb-8 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-black text-gray-600 hover:bg-indigo-50 transition shadow-sm flex items-center space-x-2 group">
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>이야기 목록으로 돌아가기</span>
          </button>
          <div class="w-full flex flex-col items-center text-center mb-10 print:hidden">
            <h2 class="text-4xl font-black text-gray-900 mb-2 tracking-tight">{{ activeBookTitle }}</h2>
            <div class="flex items-center justify-center space-x-3 text-gray-400 font-bold text-sm">
              <span>{{ activeBookDescription }}</span>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{{ activeBookDateRange }}</span>
            </div>
          </div>
          <div class="relative w-full flex justify-center items-center py-8 print:py-0 print:block overflow-visible">
            <template v-if="!isLoading">
              <BookViewer v-if="sortedPages.length > 0" :pages="sortedPages" :currentPage="currentPage" @next="nextPage" @prev="prevPage" class="print:hidden" />
              <div v-else class="h-[600px] w-[900px] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center p-20">
                 <h3 class="text-2xl font-black text-gray-300 mb-4 uppercase">아직 빈 이야기입니다</h3>
                 <button @click="currentView = 'ADD/EDIT'" class="px-8 py-3 bg-indigo-600 text-white rounded-full font-black text-sm">첫 페이지 추가하기</button>
              </div>
            </template>
            <div v-else class="h-[700px] flex items-center justify-center text-indigo-600 font-black animate-pulse">불러오는 중...</div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="max-w-6xl w-full">
          <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-12">내 이야기 목록</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div @click="openBookDetail(null)" class="group cursor-pointer">
              <div class="aspect-[3/4] bg-[#FFB6C1] rounded-[2rem] shadow-xl overflow-hidden relative transform group-hover:-translate-y-4 transition-all duration-500">
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <h3 class="text-3xl font-black mb-2">소나기</h3>
                  <span class="text-xs font-bold opacity-70">홍길동 병장의 일기</span>
                </div>
              </div>
              <p class="mt-6 text-center font-black text-gray-900">기본 이야기 (소나기)</p>
            </div>
            <div v-for="(book, index) in bookList" :key="book.bookUid" class="group relative cursor-pointer">
              <button @click.stop="handleDeleteBook(book.bookUid)" class="absolute -top-2 -right-2 z-20 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div @click="openBookDetail(book.bookUid)" class="aspect-[3/4] bg-indigo-600 rounded-[2rem] shadow-xl overflow-hidden relative transform group-hover:-translate-y-4 transition-all duration-500">
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <h3 class="text-3xl font-black mb-2 line-clamp-2">{{ book.title }}</h3>
                  <span class="text-xs font-bold opacity-70">{{ book.description }}</span>
                </div>
              </div>
              <p class="mt-6 text-center font-black text-gray-900">이야기 {{ index + 1 }}</p>
            </div>
          </div>
        </div>
      </template>
    </main>

    <main v-else class="flex-grow flex flex-col items-center py-12 px-6">
      <div class="max-w-6xl w-full">
        <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-10">페이지 수정/추가/삭제</h2>
        <div class="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div class="flex items-center space-x-4">
              <span class="text-sm font-bold text-gray-500">책 선택:</span>
              <select v-model="activeBookUid" @change="selectBook(activeBookUid)" class="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm">
                 <option :value="null">기본 이야기 (소나기)</option>
                 <option v-for="book in bookList" :key="book.bookUid" :value="book.bookUid">{{ book.title }}</option>
              </select>
           </div>
           <button @click="openAddModal" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg transition">+ 새 페이지 추가</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="page in sortedPages" :key="page.id" class="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="relative h-48 overflow-hidden">
               <img :src="page.image" class="w-full h-full object-cover" />
               <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                  <button @click="editPage(page)" class="p-3 bg-white rounded-full text-gray-800 hover:bg-indigo-600 hover:text-white transition">✏️</button>
                  <button @click="deletePage(page.id)" class="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition">🗑️</button>
               </div>
            </div>
            <div class="p-6">
               <div class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">날짜: {{ page.date }}</div>
               <h3 class="text-xl font-black text-gray-900 mb-2">{{ page.title }}</h3>
               <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">{{ page.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal for Page Add/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center px-6">
       <div @click="showModal = false" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
       <div class="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <h3 class="text-3xl font-black text-gray-900 mb-8">{{ editingId ? '페이지 수정' : '새 페이지 추가' }}</h3>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">날짜 선택</label>
                <input v-model="form.date" type="date" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">제목</label>
                <input v-model="form.title" placeholder="페이지 제목" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition" />
              </div>
            </div>
            <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">내용</label>
                <textarea v-model="form.content" rows="4" placeholder="기록하고 싶은 이야기를 입력하세요..." class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition"></textarea>
            </div>
            <div class="relative group">
              <div class="w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" />
                <span v-else class="text-gray-400 font-bold">📸 사진 업로드 (선택사항)</span>
                <input type="file" @change="handleImageUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>
            <div class="flex space-x-4 pt-4">
              <button @click="showModal = false" class="flex-grow py-4 px-6 bg-gray-100 text-gray-600 rounded-2xl font-black">취소</button>
              <button @click="savePage" class="flex-grow py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black" :disabled="isLoading">
                {{ isLoading ? '저장 중...' : '저장하기' }}
              </button>
            </div>
          </div>
       </div>
    </div>

    <!-- Modal for New Book -->
    <div v-if="showNewBookModal" class="fixed inset-0 z-[200] flex items-center justify-center px-6">
       <div @click="showNewBookModal = false" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
       <div class="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <h3 class="text-3xl font-black text-gray-900 mb-8 text-center">새 이야기 제작</h3>
          <div class="space-y-6">
            <input v-model="newBookName" placeholder="이야기 제목" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" />
            <input v-model="newBookDescription" placeholder="부제목/설명" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold" />
            <div class="flex space-x-4 pt-4">
              <button @click="showNewBookModal = false" class="flex-grow py-4 px-6 bg-gray-100 text-gray-600 rounded-2xl font-black">취소</button>
              <button @click="submitNewBook" class="flex-grow py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black" :disabled="isLoading">제작하기</button>
            </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { DINO_LIAH_PAGES } from './constants/data';
import BookViewer from './components/BookViewer.vue';

const pages = ref([]);
const currentPage = ref(0);
const currentView = ref('MY BOOK');
const bookList = ref([]);
const activeBookUid = ref(null);
const isLoading = ref(false);
const selectedBookForViewer = ref(null);
const userRole = ref('user_1');

const showNewBookModal = ref(false);
const newBookName = ref('');
const newBookDescription = ref('');
const showModal = ref(false);
const editingId = ref(null);
const form = reactive({ date: '', title: '', content: '', image: '' });

onMounted(async () => { await fetchBooks(); });
watch(userRole, async () => { selectedBookForViewer.value = null; activeBookUid.value = null; pages.value = []; await fetchBooks(); });

const goHome = () => { currentView.value = 'MY BOOK'; selectedBookForViewer.value = null; };
const openBookDetail = async (bookUid) => { await selectBook(bookUid); selectedBookForViewer.value = true; };
const handleCreateNewBook = () => { newBookName.value = ''; newBookDescription.value = ''; showNewBookModal.value = true; };

const fetchBooks = async () => {
  try {
    const res = await fetch('http://localhost:4001/api/books', { headers: { 'x-user-id': userRole.value } });
    bookList.value = await res.json();
  } catch (e) { console.error('[Frontend] Fetch Books Error:', e); }
};

const submitNewBook = async () => {
  if (!newBookName.value.trim()) return alert('제목을 입력하세요.');
  isLoading.value = true;
  try {
    const res = await fetch('http://localhost:4001/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userRole.value },
      body: JSON.stringify({ title: newBookName.value, description: newBookDescription.value })
    });
    if (res.ok) { await fetchBooks(); showNewBookModal.value = false; }
    else { alert('도서 생성에 실패했습니다.'); }
  } catch (e) { alert('네트워크 오류가 발생했습니다.'); } finally { isLoading.value = false; }
};

const handleDeleteBook = async (bookUid) => {
  if (!confirm('이야기 자체를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`http://localhost:4001/api/books/${bookUid}`, { method: 'DELETE' });
    if (res.ok) { await fetchBooks(); }
  } catch (e) { alert('삭제 실패'); }
};

const selectBook = async (bookUid) => {
  activeBookUid.value = bookUid;
  currentPage.value = 0;
  pages.value = [];
  if (!bookUid) { pages.value = [...DINO_LIAH_PAGES]; return; }
  isLoading.value = true;
  try {
    const res = await fetch(`http://localhost:4001/api/books/${bookUid}/contents`);
    const data = await res.json();
    if (Array.isArray(data)) {
      pages.value = data.map((item, i) => ({
        id: item.contentUid,
        chapter: `Chapter ${i + 1}`,
        title: item.parameters?.title || '제목 없음',
        content: item.parameters?.contents || '',
        image: item.parameters?.imageUrl || item.parameters?.photo1 || 'https://via.placeholder.com/800x600?text=Story',
        date: item.parameters?.dateStr || item.parameters?.date || ''
      }));
    }
  } catch (e) { console.error('[Frontend] Select Book Error:', e); } finally { isLoading.value = false; }
};

const openAddModal = () => {
  if (!activeBookUid.value) return alert('기본 이야기는 수정할 수 없습니다.');
  editingId.value = null; form.date = new Date().toISOString().split('T')[0]; form.title = ''; form.content = ''; form.image = '';
  showModal.value = true;
};

const editPage = (page) => {
  editingId.value = page.id; form.date = page.date; form.title = page.title; form.content = page.content; form.image = page.image;
  showModal.value = true;
};

const savePage = async () => {
  if (!form.title || !form.content || !form.date) return alert('날짜, 제목, 내용을 모두 입력하세요.');
  
  // 연도 4자리 검증 로직
  const year = new Date(form.date).getFullYear();
  if (year > 9999 || year < 1000) return alert('연도는 4자리 숫자로 정확히 입력해야 합니다. (예: 2026)');

  isLoading.value = true;
  try {
    const payload = {
      parameters: { title: form.title, contents: form.content, dateStr: form.date, imageUrl: form.image || '' }
    };
    const method = editingId.value ? 'PUT' : 'POST';
    const url = editingId.value 
      ? `http://localhost:4001/api/books/${activeBookUid.value}/contents/${editingId.value}`
      : `http://localhost:4001/api/books/${activeBookUid.value}/contents`;

    console.log(`[Frontend] Saving page: ${method} ${url}`, payload);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) { 
      alert('성공적으로 저장되었습니다.');
      await selectBook(activeBookUid.value); 
      showModal.value = false; 
    }
    else { 
      console.error('[Frontend] Save Page API Error:', data);
      alert(`API 연동 오류: ${data.error || '요청 처리에 실패했습니다.'}`); 
    }
  } catch (e) { 
    console.error('[Frontend] Save Page Network Error:', e);
    alert('서버와 통신할 수 없습니다.'); 
  } finally { isLoading.value = false; }
};

const deletePage = async (id) => {
  if (!confirm('삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`http://localhost:4001/api/books/${activeBookUid.value}/contents/${id}`, { method: 'DELETE' });
    if (res.ok) { alert('삭제되었습니다.'); await selectBook(activeBookUid.value); }
    else { const data = await res.json(); alert(`삭제 실패: ${data.error || '알 수 없는 오류'}`); }
  } catch (e) { alert('네트워크 오류'); }
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => { form.image = event.target.result; };
    reader.readAsDataURL(file);
  }
};

const sortedPages = computed(() => [...pages.value].sort((a, b) => new Date(a.date) - new Date(b.date)));
const activeBookTitle = computed(() => activeBookUid.value ? bookList.value.find(b => b.bookUid === activeBookUid.value)?.title : '소나기');
const activeBookDescription = computed(() => activeBookUid.value ? bookList.value.find(b => b.bookUid === activeBookUid.value)?.description : '홍길동 병장의 일기');
const activeBookDateRange = computed(() => sortedPages.value.length ? `${sortedPages.value[0].date} ~ ${sortedPages.value[sortedPages.value.length-1].date}` : '');
const nextPage = () => { if (currentPage.value < sortedPages.value.length + 1) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 0) currentPage.value--; };
</script>

<style>
body { @apply bg-[#F5F5F5] antialiased; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
