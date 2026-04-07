<template>
  <div class="min-h-screen bg-[#faf9f6] font-sans text-gray-900">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-[100] shadow-sm flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-[#4B5320] rounded flex items-center justify-center text-white shadow-md">
          <span class="text-lg">🎖️</span>
        </div>
        <h1 class="text-lg font-black tracking-tight">SONAGI <span class="text-[#4B5320]">REBOOT</span></h1>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          @click="createBook"
          :disabled="isCreating || sortedEpisodes.length === 0"
          class="px-6 py-2 bg-[#4B5320] text-white text-xs font-black rounded-full hover:bg-[#3f4627] transition-all shadow-lg disabled:opacity-30 uppercase tracking-widest"
        >
          {{ isCreating ? 'Processing...' : 'Export Digital Book' }}
        </button>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto grid md:grid-cols-2 min-h-[calc(100vh-65px)]">
      <!-- Left: Sticky Book Viewer -->
      <section class="bg-[#f2f1ed] p-12 flex flex-col items-center border-r border-gray-200/50">
        <div class="sticky top-20 w-full flex flex-col items-center">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-serif font-black text-gray-800">Preview Archive</h2>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Interact with your digital diary</p>
          </div>
          
          <div class="book-container scale-90 lg:scale-100 transition-transform duration-500">
            <div v-if="sortedEpisodes.length === 0" class="empty-state-card w-[420px] h-[580px] bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center border border-gray-100">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <span class="text-4xl opacity-20">📖</span>
              </div>
              <p class="text-sm font-black text-gray-300 uppercase tracking-widest">No entries recorded</p>
              <p class="text-xs text-gray-400 mt-2">Start adding moments on the right</p>
            </div>
            <BookViewer v-else :episodes="sortedEpisodes" :coverTitle="coverTitle" />
          </div>
        </div>
      </section>

      <!-- Right: Scrollable Content & Form -->
      <section class="p-12 overflow-y-auto">
        <div class="max-w-xl mx-auto space-y-12">
          <!-- Form Section -->
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden relative">
            <div class="absolute top-0 left-0 w-1 h-full bg-[#4B5320]"></div>
            <h3 class="text-xl font-black text-gray-900 mb-6 flex items-center">
              <span class="mr-3">✍️</span> New Record
            </h3>
            
            <div class="grid gap-6">
              <div class="space-y-4 pb-6 border-b border-gray-50">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Archive Title</label>
                <input v-model="coverTitle" class="form-input" placeholder="Title of your diary" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Event Date</label>
                  <input v-model="newEpisode.date" type="date" class="form-input" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Category</label>
                  <select v-model="newEpisode.tag" class="form-input bg-gray-50/50">
                    <option value="훈련">🎖️ Training</option>
                    <option value="진급">🚀 Promotion</option>
                    <option value="휴가">🏖️ Vacation</option>
                    <option value="외출">🍕 Outing</option>
                    <option value="자대">🏠 Unit Life</option>
                    <option value="기타">✨ Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Subject</label>
                <input v-model="newEpisode.title" class="form-input" placeholder="What happened?" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Photo Reference (URL)</label>
                <input v-model="newEpisode.image" class="form-input" placeholder="https://image-link.com" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Description</label>
                <textarea v-model="newEpisode.content" rows="4" class="form-input resize-none" placeholder="Write your memory here..."></textarea>
              </div>

              <button 
                @click="addEpisode"
                class="w-full py-4 bg-[#4B5320] text-white rounded-xl font-black text-sm hover:bg-[#3f4627] transition-all shadow-lg active:scale-[0.98] uppercase tracking-[0.2em] mt-2"
              >
                Add to Timeline
              </button>
            </div>
          </div>

          <!-- Timeline Section -->
          <div class="space-y-6">
            <div class="flex justify-between items-end border-b border-gray-100 pb-4">
              <h3 class="text-xl font-black text-gray-900">Timeline <span class="text-gray-300 font-serif font-normal italic ml-2">({{ sortedEpisodes.length }})</span></h3>
              <button v-if="episodes.length > 0" @click="episodes = []" class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest">Reset All</button>
            </div>

            <div v-if="sortedEpisodes.length === 0" class="py-20 text-center">
              <p class="text-sm font-bold text-gray-300 uppercase tracking-widest italic">No memories recorded yet</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="episode in sortedEpisodes" 
                :key="episode.id"
                class="group flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                  <img v-if="episode.image" :src="episode.image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div v-else class="w-full h-full flex items-center justify-center text-lg opacity-20">🖼️</div>
                </div>
                <div class="ml-4 flex-grow">
                  <div class="flex items-center space-x-2 mb-0.5">
                    <span class="text-[9px] font-black uppercase text-[#4B5320] tracking-tighter">{{ episode.tag }}</span>
                    <span class="text-[9px] text-gray-400 font-mono">{{ episode.date }}</span>
                  </div>
                  <h4 class="font-bold text-gray-900 text-sm">{{ episode.title }}</h4>
                </div>
                <button @click="removeEpisode(episode.id)" class="ml-4 p-2 text-gray-200 hover:text-red-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MILITARY_EPISODES } from '../constants/data';
import BookViewer from '../components/BookViewer.vue';

const episodes = ref([...MILITARY_EPISODES]);
const isCreating = ref(false);
const coverTitle = ref('My Military Archive');

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
  if (!newEpisode.value.title || !newEpisode.value.date) {
    alert('Please enter both date and title.');
    return;
  }
  episodes.value.push({ id: Date.now(), ...newEpisode.value });
  newEpisode.value = {
    date: new Date().toISOString().split('T')[0],
    tag: '기타',
    title: '',
    content: '',
    image: ''
  };
};

const removeEpisode = (id) => {
  episodes.value = episodes.value.filter(e => e.id !== id);
};

const createBook = async () => {
  isCreating.value = true;
  try {
    const response = await fetch('http://localhost:4000/api/books/auto-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: coverTitle.value, episodes: episodes.value })
    });
    if (!response.ok) throw new Error('Failed to reach backend.');
    const data = await response.json();
    if (data.bookUid) alert(`Success! Book UID: ${data.bookUid}`);
    else alert('Creation failed: ' + (data.message || 'Unknown error'));
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    isCreating.value = false;
  }
};
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-3 border border-gray-100 rounded-lg bg-gray-50/30 focus:bg-white focus:ring-2 focus:ring-[#4B5320]/10 focus:border-[#4B5320] outline-none transition-all text-sm font-medium placeholder:text-gray-300;
}

.book-container {
  perspective: 2500px;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
