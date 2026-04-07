<template>
  <div class="book-wrapper">
    <div class="book" :class="{ 'is-flipped': isFlipped }">
      <div class="book-pages" ref="bookRef">
        <!-- Cover Page -->
        <div class="page cover-front shadow-2xl" :style="{ zIndex: pages.length + 1 }">
          <div class="spine-effect"></div>
          <div class="cover-content border-double border-4 border-white/20 m-4 h-[calc(100%-2rem)]">
            <div class="diary-badge bg-[#4B5320] text-xs font-black tracking-[0.2em] px-3 py-1 mb-6 shadow-sm">MILITARY SERVICE</div>
            <h1 class="cover-title text-4xl font-serif font-black tracking-tight leading-tight px-4">{{ coverTitle }}</h1>
            <div class="cover-decoration my-8 flex items-center w-full px-10">
              <div class="h-[1px] bg-white/30 flex-grow"></div>
              <div class="mx-4 text-yellow-500 text-xl">★</div>
              <div class="h-[1px] bg-white/30 flex-grow"></div>
            </div>
            <p class="cover-subtitle font-medium opacity-70 italic tracking-wide">Sonagi Reboot: Digital Archive</p>
            <div class="cover-footer mt-auto pb-6 opacity-40 text-[10px] font-bold tracking-[0.3em] uppercase">
              Republic of Korea Army
            </div>
          </div>
        </div>

        <!-- Inside Pages -->
        <div 
          v-for="(page, index) in pages" 
          :key="index"
          class="page shadow-xl"
          :class="{ 'flipped': index < currentPage }"
          :style="{ zIndex: pages.length - index }"
          @click="handlePageClick(index)"
        >
          <div class="page-side front bg-[#faf9f6]">
            <div class="page-content p-10 flex flex-col h-full">
              <div class="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <span class="font-mono text-xs font-black text-gray-400 tracking-tighter">{{ page.date }}</span>
                <span class="text-[9px] font-black px-2 py-0.5 rounded bg-gray-900 text-white uppercase tracking-widest">{{ page.tag }}</span>
              </div>
              <h2 class="text-xl font-black text-gray-900 mb-6 leading-tight">{{ page.title }}</h2>
              <div class="page-body flex-grow overflow-hidden">
                <div v-if="page.image" class="w-full h-44 mb-6 rounded-lg overflow-hidden shadow-inner bg-gray-100">
                  <img :src="page.image" class="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" />
                </div>
                <p class="text-sm leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">{{ page.content }}</p>
              </div>
              <div class="mt-auto pt-6 text-center border-t border-gray-50 text-[10px] font-bold text-gray-300">{{ index * 2 + 1 }}</div>
            </div>
          </div>
          <div class="page-side back bg-[#f4f3ef]">
            <div class="page-content p-10 h-full flex flex-col">
              <div class="flex-grow opacity-20" style="background-image: radial-gradient(#000 0.5px, transparent 0.5px); background-size: 20px 20px;"></div>
              <div class="mt-auto pt-6 text-center text-[10px] font-bold text-gray-300">{{ index * 2 + 2 }}</div>
            </div>
          </div>
        </div>

        <!-- Back Cover -->
        <div class="page cover-back shadow-2xl" :style="{ zIndex: 0 }">
          <div class="cover-content flex items-center justify-center">
            <div class="text-[10px] font-black tracking-[0.5em] opacity-20 uppercase">End of Record</div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-overlay mt-12 flex items-center justify-center space-x-6">
        <button @click="prevPage" class="nav-btn" :disabled="currentPage === 0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        </button>
        <div class="px-4 py-1.5 bg-white/80 backdrop-blur rounded-full text-[11px] font-black text-gray-400 shadow-sm border border-gray-100">
          {{ currentPage === 0 ? 'COVER' : currentPage + ' / ' + pages.length }}
        </div>
        <button @click="nextPage" class="nav-btn" :disabled="currentPage >= pages.length">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  episodes: { type: Array, required: true },
  coverTitle: { type: String, default: '나의 병영일기' }
});

const currentPage = ref(0);
const pages = computed(() => props.episodes);

const nextPage = () => { if (currentPage.value < pages.value.length) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 0) currentPage.value--; };
const handlePageClick = (index) => {
  if (index === currentPage.value) nextPage();
  else if (index === currentPage.value - 1) prevPage();
};
</script>

<style scoped>
.book-wrapper {
  perspective: 2500px;
  padding: 20px;
}

.book {
  position: relative;
  width: 420px;
  height: 580px;
  transform-style: preserve-3d;
}

.book-pages {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-origin: left;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;
}

.page.flipped {
  transform: rotateY(-180deg);
}

.page-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 0 4px 4px 0;
  box-shadow: inset 3px 0 20px rgba(0,0,0,0.05);
}

.page-side.back {
  transform: rotateY(180deg);
  border-radius: 4px 0 0 4px;
}

/* Spine & Cover Effects */
.spine-effect {
  position: absolute;
  left: 0;
  top: 0;
  width: 25px;
  height: 100%;
  background: linear-gradient(to right, 
    rgba(0,0,0,0.3) 0%, 
    rgba(0,0,0,0) 20%, 
    rgba(255,255,255,0.1) 40%, 
    rgba(0,0,0,0.1) 100%);
  z-index: 10;
}

.cover-front {
  background: #3f4627; /* Dark Olive */
  color: white;
  border-radius: 0 8px 8px 0;
}

.cover-back {
  background: #353b21;
  border-radius: 8px 0 0 8px;
}

.nav-btn {
  @apply w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all disabled:opacity-20 active:scale-90;
}
</style>
