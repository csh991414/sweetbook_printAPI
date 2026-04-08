<template>
  <div class="min-h-screen bg-[#F5F5F5] flex flex-col font-sans text-gray-800 print:bg-white">
    <!-- Top Navigation (Hidden on print) -->
    <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-sm print:hidden">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2 cursor-pointer" @click="goHome">
          <span class="text-2xl font-black text-indigo-600">AI</span>
          <span class="text-xl font-bold tracking-tighter text-gray-900">STORYCLASS</span>
        </div>
        <div class="h-6 w-px bg-gray-200"></div>
        <div class="flex items-center">
          <span class="text-sm font-bold text-gray-400">SONAKI</span>
        </div>
      </div>
      
      <div class="hidden md:flex items-center space-x-8">
        <nav class="flex space-x-6 text-[13px] font-bold text-gray-500">
          <button 
            @click="currentView = 'MY BOOK'; selectedBookForViewer = null" 
            :class="['hover:text-indigo-600 transition uppercase', currentView === 'MY BOOK' ? 'text-indigo-600 underline underline-offset-8' : '']"
          >
            내 이야기
          </button>
          <button 
            @click="currentView = 'ADD/EDIT'" 
            :class="['hover:text-indigo-600 transition uppercase', currentView === 'ADD/EDIT' ? 'text-indigo-600 underline underline-offset-8' : '']"
          >
            페이지 수정/추가/삭제
          </button>
        </nav>
        <div class="flex items-center space-x-4 ml-4">
          <button 
            @click="handleCreateNewBook"
            class="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
          >
            새 책 생성
          </button>
          <div class="h-6 w-px bg-gray-200"></div>
          <button class="text-xs font-bold text-gray-400 hover:text-gray-900">LOGIN</button>
          <button class="text-xs font-bold text-gray-400 hover:text-gray-900">JOIN</button>
        </div>
      </div>
    </header>

    <!-- Main Content (내 이야기 - 목록 또는 상세 보기) -->
    <main v-if="currentView === 'MY BOOK'" class="flex-grow flex flex-col items-center py-12 px-6 print:py-0 print:px-0">
      
      <!-- 상세 보기 모드 (책 펼쳐보기) -->
      <template v-if="selectedBookForViewer">
        <div class="w-full max-w-screen-xl flex flex-col items-center">
          <!-- Improved Back Button -->
          <button 
            @click="selectedBookForViewer = null" 
            class="self-start mb-8 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-black text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center space-x-2 group"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span>
            <span>이야기 목록으로 돌아가기</span>
          </button>

          <!-- Book Header Info -->
          <div class="w-full flex flex-col items-center text-center mb-10 print:hidden">
            <h2 class="text-4xl font-black text-gray-900 mb-2 tracking-tight">{{ activeBookTitle }}</h2>
            <div class="flex items-center justify-center space-x-3 text-gray-400 font-bold text-sm">
              <span>{{ activeBookDescription }}</span>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{{ activeBookDateRange }}</span>
            </div>
          </div>

          <!-- Book Viewer Wrapper -->
          <div class="relative w-full flex justify-center items-center py-8 print:py-0 print:block overflow-visible">
            <BookViewer 
              v-if="!isLoading"
              :pages="sortedPages" 
              :currentPage="currentPage" 
              @next="nextPage" 
              @prev="prevPage" 
              class="print:hidden"
            />
            <div v-else class="h-[700px] flex items-center justify-center text-indigo-600 font-black animate-pulse">
              LOADING STORY...
            </div>
          </div>

          <!-- Book Action Buttons -->
          <div class="flex space-x-4 mt-12 print:hidden">
            <button @click="printToPDF" class="px-8 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition">SHARE (PDF)</button>
            <button @click="submitOrder" class="px-10 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">ORDER PRINT (API)</button>
          </div>
        </div>
      </template>

      <!-- 목록 모드 -->
      <template v-else>
        <div class="max-w-6xl w-full">
          <h2 class="text-4xl font-black text-gray-900 mb-12 tracking-tight">내 이야기 목록</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <!-- 기본 책 (소나기) -->
            <div @click="openBookDetail(null)" class="group cursor-pointer">
              <div class="aspect-[3/4] bg-[#FFB6C1] rounded-[2rem] shadow-xl overflow-hidden relative transform group-hover:-translate-y-4 transition-all duration-500">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <span class="text-[10px] font-black tracking-[0.3em] mb-4 opacity-80">DEFAULT STORY</span>
                  <h3 class="text-3xl font-black mb-2">소나기</h3>
                  <div class="w-10 h-1 bg-white/50 rounded-full mb-6"></div>
                  <span class="text-xs font-bold opacity-70">홍길동 병장의 일기</span>
                </div>
              </div>
              <p class="mt-6 text-center font-black text-gray-900">기본 이야기 (소나기)</p>
            </div>

            <!-- API 생성 책들 -->
            <div v-for="(book, index) in bookList" :key="book.bookUid" @click="openBookDetail(book.bookUid)" class="group cursor-pointer">
              <div class="aspect-[3/4] bg-indigo-600 rounded-[2rem] shadow-xl overflow-hidden relative transform group-hover:-translate-y-4 transition-all duration-500">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <span class="text-[10px] font-black tracking-[0.3em] mb-4 opacity-80">DIGITAL STORY</span>
                  <h3 class="text-3xl font-black mb-2">{{ book.title }}</h3>
                  <div class="w-10 h-1 bg-white/50 rounded-full mb-6"></div>
                  <span class="text-xs font-bold opacity-70">사용자 생성 이야기</span>
                </div>
              </div>
              <p class="mt-6 text-center font-black text-gray-900">이야기 {{ index + 1 }}</p>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- ADD/EDIT View (기존과 동일하되 activeBookUid 기준) -->
    <main v-else class="flex-grow flex flex-col items-center py-12 px-6">
      <div class="max-w-6xl w-full">
        <div class="flex flex-col mb-10">
           <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-2">페이지 수정/추가/삭제</h2>
           <p class="text-gray-400 font-bold">현재 작업 중: <span class="text-indigo-600">{{ activeBookTitle }}</span></p>
        </div>
        
        <div class="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div class="flex items-center space-x-4">
              <span class="text-sm font-bold text-gray-500">책 선택:</span>
              <select v-model="activeBookUid" @change="selectBook(activeBookUid)" class="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm focus:ring-2 focus:ring-indigo-600/20">
                 <option :value="null">기본 이야기 (소나기)</option>
                 <option v-for="(book, index) in bookList" :key="book.bookUid" :value="book.bookUid">이야기 {{ index + 1 }}</option>
              </select>
           </div>
           <button 
             @click="openAddModal"
             class="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex items-center space-x-2"
           >
             <span class="text-lg">+</span>
             <span>새 페이지 추가</span>
           </button>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="page in sortedPages" 
            :key="page.id" 
            class="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="relative h-48 overflow-hidden">
               <img :src="page.image" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
               <div class="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-indigo-600 shadow-sm uppercase tracking-widest">
                  {{ page.chapter }}
               </div>
               <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                  <button @click="editPage(page)" class="p-3 bg-white rounded-full text-gray-800 hover:bg-indigo-600 hover:text-white transition">✏️</button>
                  <button @click="deletePage(page.id)" class="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition">🗑️</button>
               </div>
            </div>
            <div class="p-6">
               <div class="flex items-center space-x-2 text-xs font-bold text-gray-400 mb-2">
                 <span>📅 {{ page.date }}</span>
               </div>
               <h3 class="text-xl font-black text-gray-900 mb-2 line-clamp-1">{{ page.title }}</h3>
               <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">{{ page.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal for Add/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center px-6">
       <div @click="showModal = false" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
       <div class="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <h3 class="text-3xl font-black text-gray-900 mb-8">{{ editingId ? 'EDIT PAGE' : 'ADD NEW PAGE' }}</h3>
          
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                <input v-model="form.date" type="date" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                <input v-model="form.title" placeholder="Page Title" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition" />
              </div>
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Content</label>
                <textarea v-model="form.content" rows="4" placeholder="Write your story here..." class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition"></textarea>
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Image</label>
                <div class="relative group">
                  <div class="w-full h-48 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                    <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center text-gray-400">
                      <span class="text-3xl mb-2">📸</span>
                      <span class="text-xs font-bold">Select Local Image</span>
                    </div>
                    <input type="file" @change="handleImageUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>
            </div>

            <div class="flex space-x-4 pt-4">
              <button @click="showModal = false" class="flex-grow py-4 px-6 bg-gray-100 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-200 transition">CANCEL</button>
              <button @click="savePage" class="flex-grow py-4 px-6 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
                {{ editingId ? 'UPDATE PAGE' : 'CREATE PAGE' }}
              </button>
            </div>
          </div>
       </div>
    </div>

    <!-- Modal for New Book Name -->
    <div v-if="showNewBookModal" class="fixed inset-0 z-[200] flex items-center justify-center px-6">
       <div @click="showNewBookModal = false" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
       <div class="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          <h3 class="text-3xl font-black text-gray-900 mb-8 text-center">새 책 이름</h3>
          
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Book Title</label>
              <input v-model="newBookName" placeholder="책 제목을 입력하세요" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20 transition" />
            </div>

            <div class="flex space-x-4 pt-4">
              <button @click="showNewBookModal = false" class="flex-grow py-4 px-6 bg-gray-100 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-200 transition">CANCEL</button>
              <button @click="submitNewBook" class="flex-grow py-4 px-6 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition flex items-center justify-center">
                <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>생성하기</span>
              </button>
            </div>
          </div>
       </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-500 py-16 px-12 border-t border-gray-800 print:hidden">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div class="flex items-center space-x-2 mb-8 grayscale opacity-50">
            <span class="text-xl font-black text-white tracking-tighter uppercase">SONAKI</span>
          </div>
          <p class="text-xs leading-loose max-w-md mb-8">
            (주)소나기 | 서울특별시 광진구 누구로 111, 1층 <br/>
            대표이사: 홍길동 | 사업자등록번호: 111-11-1111 <br/>
            고객센터: 02-1234-5678 | 이메일: support@sonaki.com
          </p>
          <div class="flex space-x-6 text-[11px] font-bold">
            <a href="#" class="hover:text-white transition">TERMS OF SERVICE</a>
            <a href="#" class="text-gray-300 hover:text-white transition">PRIVACY POLICY</a>
          </div>
        </div>
        <div class="lg:text-right flex flex-col justify-end">
          <p class="text-[10px] tracking-widest uppercase opacity-30">© 2026 SONAKI AI ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { DINO_LIAH_PAGES } from './constants/data';
import BookViewer from './components/BookViewer.vue';

// Initialize pages with reactive state
const pages = ref([...DINO_LIAH_PAGES]);
const currentPage = ref(0);
const currentView = ref('MY BOOK');

// API Book state
const bookList = ref([]);
const activeBookUid = ref(null);
const isLoading = ref(false);
const selectedBookForViewer = ref(null);

// New Book Modal state
const showNewBookModal = ref(false);
const newBookName = ref('');

const goHome = () => {
  currentView.value = 'MY BOOK';
  selectedBookForViewer.value = null;
};

const openBookDetail = async (bookUid) => {
  await selectBook(bookUid);
  selectedBookForViewer.value = true;
};

const handleCreateNewBook = () => {
  if (confirm('기존 책 말고 새 책을 만드시겠습니까?')) {
    newBookName.value = `이야기 ${bookList.value.length + 1}`;
    showNewBookModal.value = true;
  }
};

const submitNewBook = async () => {
  if (!newBookName.value.trim()) {
    alert('책 이름을 입력해주세요.');
    return;
  }
  
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:4001/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newBookName.value, bookSpecUid: 'PHOTOBOOK_A4_SC' }),
    });

    const result = await response.json();
    if (result.bookUid) {
      alert(`'${newBookName.value}' 책이 성공적으로 생성되었습니다! \n이제 페이지를 추가해 보세요.`);
      showNewBookModal.value = false;
      await fetchBooks(); // 전체 목록 갱신
      await selectBook(result.bookUid); // 생성된 책 자동 선택 및 데이터 동기화
      currentView.value = 'ADD/EDIT'; // 편집 화면으로 이동
    }
  } catch (error) {
    console.error('Error creating new book:', error);
    alert('책 생성 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// Modal state
const showModal = ref(false);
const editingId = ref(null);
const form = reactive({
  date: '',
  title: '',
  content: '',
  image: ''
});

// Computed active book info
const activeBookTitle = computed(() => {
  if (!activeBookUid.value) return '소나기';
  const book = bookList.value.find(b => b.bookUid === activeBookUid.value);
  return book ? book.title : '이야기';
});

const activeBookDescription = computed(() => {
  if (!activeBookUid.value) return '홍길동 병장의 일기';
  return '새로운 디지털 이야기';
});

const activeBookDateRange = computed(() => {
  if (sortedPages.value.length === 0) return '';
  const first = sortedPages.value[0].date;
  const last = sortedPages.value[sortedPages.value.length - 1].date;
  return `${first} ~ ${last}`;
});

// Computed sorted pages
const sortedPages = computed(() => {
  return [...pages.value].sort((a, b) => new Date(a.date) - new Date(b.date));
});

// Fetch books on load
onMounted(async () => {
  await fetchBooks();
});

const fetchBooks = async () => {
  try {
    const response = await fetch('http://localhost:4001/api/books');
    const data = await response.json();
    if (Array.isArray(data)) {
      bookList.value = data;
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const selectBook = async (bookUid) => {
  activeBookUid.value = bookUid;
  currentPage.value = 0;
  
  if (!bookUid) {
    // Reset to local dummy data
    pages.value = [...DINO_LIAH_PAGES];
    return;
  }

  // Fetch API book contents
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:4001/api/books/${bookUid}/contents`);
    const data = await response.json();
    // Map API data to our page format
    if (Array.isArray(data)) {
      pages.value = data.map((item, i) => ({
        id: item.contentUid,
        chapter: `Chapter ${i + 1}`,
        title: item.parameters?.title || '제목 없음',
        content: item.parameters?.contents || '',
        image: item.parameters?.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
        date: item.parameters?.dateStr || '2026-04-01'
      }));
    } else {
      pages.value = [];
    }
  } catch (error) {
    console.error('Error fetching contents:', error);
    pages.value = [];
  } finally {
    isLoading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < sortedPages.value.length + 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

// CRUD Operations
const openAddModal = () => {
  editingId.value = null;
  form.date = new Date().toISOString().split('T')[0];
  form.title = '';
  form.content = '';
  form.image = '';
  showModal.value = true;
};

const editPage = (page) => {
  editingId.value = page.id;
  form.date = page.date;
  form.title = page.title;
  form.content = page.content;
  form.image = page.image;
  showModal.value = true;
};

const deletePage = async (id) => {
  if (!confirm('Are you sure you want to delete this page?')) return;

  if (!activeBookUid.value) {
    // Local delete
    pages.value = pages.value.filter(p => p.id !== id);
  } else {
    // API delete
    try {
      await fetch(`http://localhost:4001/api/books/${activeBookUid.value}/contents/${id}`, {
        method: 'DELETE'
      });
      await selectBook(activeBookUid.value); // Refresh
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.image = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const savePage = async () => {
  if (!form.date || !form.title || !form.content || !form.image) {
    alert('Please fill all fields');
    return;
  }

  if (!activeBookUid.value) {
    // Local save
    if (editingId.value) {
      const index = pages.value.findIndex(p => p.id === editingId.value);
      if (index !== -1) {
        pages.value[index] = { ...pages.value[index], date: form.date, title: form.title, content: form.content, image: form.image };
      }
    } else {
      pages.value.push({ id: Date.now(), chapter: `NEW PAGE`, date: form.date, title: form.title, content: form.content, image: form.image });
    }
    updateChapters();
  } else {
    // API save (Add content)
    try {
      await fetch(`http://localhost:4001/api/books/${activeBookUid.value}/contents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateUid: '5iwCNE0Xa8Gb', // Sample content template
          parameters: {
            title: form.title,
            contents: form.content,
            dateStr: form.date,
            imageUrl: form.image.startsWith('data:') ? 'https://via.placeholder.com/800x600?text=Uploaded+Image' : form.image
          }
        })
      });
      await selectBook(activeBookUid.value); // Refresh
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  }
  
  showModal.value = false;
};

const updateChapters = () => {
  const sorted = [...pages.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  sorted.forEach((p, i) => {
    p.chapter = `Chapter ${i + 1}`;
  });
  pages.value = sorted;
};

// API Integration: Create New Book
const createNewBook = async () => {
  try {
    const response = await fetch('http://localhost:4001/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `이야기 ${bookList.value.length + 1}`, bookSpecUid: 'PHOTOBOOK_A4_SC' }),
    });

    const result = await response.json();
    if (result.bookUid) {
      alert(`새 책이 성공적으로 생성되었습니다! \nBook UID: ${result.bookUid}`);
      await fetchBooks(); // Refresh list
      await selectBook(result.bookUid); // Switch to new book
    }
  } catch (error) {
    alert('책 생성 중 오류가 발생했습니다.');
  }
};

// API Integration: Submit Order (필수 요구사항)
const submitOrder = async () => {
  if (!activeBookUid.value) {
    alert('기본 이야기는 API 주문이 불가능합니다. 새 책을 생성해 주세요.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:4001/api/books/${activeBookUid.value}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverName: '테스트 유저' }),
    });

    const result = await response.json();
    if (result.orderUid) {
      alert(`주문이 성공적으로 접수되었습니다! \nOrder UID: ${result.orderUid}`);
    } else {
      throw new Error(result.error || '주문 실패');
    }
  } catch (error) {
    alert('주문 중 오류가 발생했습니다: ' + error.message);
  }
};
</script>

<style>
/* Global styles */
body {
  @apply bg-[#F5F5F5] antialiased;
}

::selection {
  @apply bg-indigo-100 text-indigo-900;
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }
  body {
    background: white;
  }
  .print-page {
    page-break-after: always;
  }
}

/* Hide scrollbar for cleaner look */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-full hover:bg-gray-300;
}
</style>
