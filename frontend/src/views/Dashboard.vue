<template>
  <div class="h-screen flex flex-col bg-white overflow-hidden font-sans text-gray-900">
    <!-- Top Nav -->
    <nav class="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white z-[100]">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-indigo-950 rounded-lg flex items-center justify-center text-white shadow-lg">
          <span class="text-xl">🎖️</span>
        </div>
        <div>
          <h1 class="text-lg font-black tracking-tighter text-indigo-950 uppercase leading-none">Sonagi Reboot</h1>
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Digital Archive System</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-6">
        <button @click="isDrawerOpen = true" class="text-sm font-bold text-gray-600 hover:text-indigo-900 transition-colors">새 기록 추가</button>
        <button 
          @click="createBook"
          :disabled="isCreating || episodes.length === 0"
          class="px-6 py-2.5 bg-[#4B5320] text-white text-xs font-black rounded-full shadow-lg shadow-olive-900/20 hover:bg-[#3f4627] transition-all disabled:opacity-30 uppercase tracking-widest"
        >
          {{ isCreating ? '제작 중...' : '디지털 북 제작' }}
        </button>
      </div>
    </nav>

    <!-- Main Content (Book Area) -->
    <main class="flex-grow bg-[#F7F3E8] relative flex items-center justify-center overflow-hidden">
      <div class="w-full h-full max-w-6xl mx-auto flex items-center justify-center">
        <BookViewer 
          :episodes="sortedEpisodes" 
          :coverTitle="coverTitle" 
          :currentPage="currentPageIndex"
          @next="nextPage"
          @prev="prevPage"
        />
      </div>

      <!-- Side Drawer (Input Form) -->
      <Transition name="slide">
        <div v-if="isDrawerOpen" class="absolute inset-y-0 right-0 w-[450px] bg-white shadow-2xl z-[200] border-l border-gray-100 flex flex-col">
          <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 class="text-xl font-black text-indigo-950 uppercase tracking-tight">Add New Memory</h2>
            <button @click="isDrawerOpen = false" class="p-2 hover:bg-white rounded-full transition-all text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-8 flex-grow overflow-y-auto space-y-8">
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diary Title</label>
              <input v-model="coverTitle" class="drawer-input" placeholder="Title on the cover" />
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                <input v-model="newEpisode.date" type="date" class="drawer-input" />
              </div>
              <div class="space-y-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                <select v-model="newEpisode.tag" class="drawer-input">
                  <option value="훈련">🎖️ Training</option>
                  <option value="진급">🚀 Promotion</option>
                  <option value="휴가">🏖️ Vacation</option>
                  <option value="외출">🍕 Outing</option>
                  <option value="자대">🏠 Unit Life</option>
                  <option value="기타">✨ Others</option>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</label>
              <input v-model="newEpisode.title" class="drawer-input" placeholder="Event name" />
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Photo URL</label>
              <input v-model="newEpisode.image" class="drawer-input" placeholder="https://..." />
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea v-model="newEpisode.content" rows="6" class="drawer-input resize-none" placeholder="Details..."></textarea>
            </div>
          </div>

          <div class="p-8 bg-gray-50/50 border-t border-gray-100">
            <button @click="addEpisode" class="w-full py-4 bg-[#4B5320] text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg hover:bg-[#3f4627] active:scale-95 transition-all">
              Save Memory
            </button>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Bottom Thumbnail Carousel -->
    <footer class="h-44 bg-white border-t border-gray-100 px-8 flex items-center overflow-x-auto overflow-y-hidden space-x-4 scrollbar-hide">
      <!-- Cover Thumbnail -->
      <div 
        @click="currentPageIndex = 0"
        class="flex-shrink-0 cursor-pointer transition-all duration-300 transform"
        :class="[currentPageIndex === 0 ? 'scale-110 -translate-y-2' : 'hover:scale-105']"
      >
        <div class="w-24 h-32 bg-indigo-950 rounded border-2 shadow-sm flex flex-col items-center justify-center p-2 text-center"
             :class="[currentPageIndex === 0 ? 'border-yellow-500 shadow-xl' : 'border-gray-100']">
          <span class="text-[8px] font-black text-white/40 uppercase mb-2">Cover</span>
          <span class="text-[9px] font-bold text-white line-clamp-2 leading-tight">{{ coverTitle }}</span>
          <div class="mt-2 text-yellow-500 text-[8px]">★</div>
        </div>
      </div>

      <!-- Episode Thumbnails -->
      <div 
        v-for="(episode, index) in sortedEpisodes" 
        :key="episode.id"
        @click="currentPageIndex = index + 1"
        class="flex-shrink-0 cursor-pointer transition-all duration-300 transform"
        :class="[currentPageIndex === index + 1 ? 'scale-110 -translate-y-2' : 'hover:scale-105']"
      >
        <div class="w-24 h-32 bg-white rounded border-2 shadow-sm flex flex-col overflow-hidden"
             :class="[currentPageIndex === index + 1 ? 'border-yellow-500 shadow-xl' : 'border-gray-100']">
          <div class="h-16 bg-gray-100 w-full overflow-hidden">
            <img v-if="episode.image" :src="episode.image" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center opacity-20 text-xs">🖼️</div>
          </div>
          <div class="p-2 flex flex-col flex-grow">
            <span class="text-[7px] font-black text-indigo-900 uppercase tracking-tighter mb-0.5">{{ episode.tag }}</span>
            <span class="text-[8px] font-bold text-gray-800 line-clamp-2 leading-tight">{{ episode.title }}</span>
            <span class="mt-auto text-[6px] font-mono text-gray-300">{{ episode.date }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MILITARY_EPISODES } from '../constants/data';
import BookViewer from '../components/BookViewer.vue';

const episodes = ref([...MILITARY_EPISODES]);
const coverTitle = ref('The Soldier\'s Path');
const isDrawerOpen = ref(false);
const isCreating = ref(false);
const currentPageIndex = ref(0);

const newEpisode = ref({
  date: new Date().toISOString().split('T')[0],
  tag: '기타',
  title: '',
  content: '',
  image: ''
});

const sortedEpisodes = computed(() => {
  return [...episodes.value].sort((a, b) => new Date(a.date) - new Date(b.date));
});

const addEpisode = () => {
  if (!newEpisode.value.title || !newEpisode.value.date) return alert('Date and Subject are required.');
  episodes.value.push({ id: Date.now(), ...newEpisode.value });
  newEpisode.value = { date: new Date().toISOString().split('T')[0], tag: '기타', title: '', content: '', image: '' };
  isDrawerOpen.value = false;
  currentPageIndex.value = sortedEpisodes.value.length;
};

const nextPage = () => { if (currentPageIndex.value < episodes.value.length) currentPageIndex.value++; };
const prevPage = () => { if (currentPageIndex.value > 0) currentPageIndex.value--; };

const createBook = async () => {
  isCreating.value = true;
  try {
    const response = await fetch('http://localhost:4000/api/books/auto-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: coverTitle.value, episodes: episodes.value })
    });
    const data = await response.json();
    if (data.bookUid) alert('Successfully Created!');
  } catch (err) {
    alert('Error connecting to server.');
  } finally {
    isCreating.value = false;
  }
};
</script>

<style scoped>
.drawer-input {
  @apply w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-900/5 focus:border-indigo-950 outline-none transition-all text-sm font-medium placeholder:text-gray-300;
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.slide-enter-active, .slide-leave-active { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
