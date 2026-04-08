<template>
  <div class="relative flex items-center justify-center w-full max-w-screen-xl mx-auto px-12 h-[750px]">
    <!-- Navigation Buttons -->
    <button 
      @click="$emit('prev')" 
      class="flex-shrink-0 z-[200] p-4 rounded-full bg-white shadow-xl hover:bg-gray-50 hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none border border-gray-100"
      :disabled="currentPage === 0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <!-- 3D Book Container -->
    <div 
      class="book-container mx-16" 
      :class="{ 'is-open': currentPage > 0 && currentPage <= pages.length }"
    >
      <div 
        class="book" 
        :class="{ 'is-flipped': currentPage > 0 }"
      >
        <div class="book-pages">
          <!-- Front Cover -->
          <div 
            class="page cover-front" 
            :class="{ 'flipped': currentPage > 0 }"
            :style="{ zIndex: currentPage > 0 ? 0 : pages.length + 2 }"
          >
            <div class="page-side front bg-[#FFB6C1]">
              <div class="spine-overlay"></div>
              <div class="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center relative overflow-hidden">
                <div class="z-10">
                  <p class="text-sm font-bold tracking-[0.3em] mb-6 opacity-90">소중한 나의 병영생활 일기</p>
                  <h1 class="text-6xl font-black mb-4 drop-shadow-lg tracking-tight leading-tight">소나기</h1>
                  <div class="w-16 h-1 bg-white mx-auto mb-8 rounded-full"></div>
                  <p class="text-xl font-medium opacity-90">지은이 <span class="font-bold">홍길동</span></p>
                </div>

                <div class="mt-20 z-10">
                  <div class="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span class="text-6xl">🪖</span>
                  </div>
                </div>

                <p class="absolute bottom-10 left-0 right-0 text-[10px] font-bold tracking-widest opacity-50 uppercase italic">Created with AI Storyclass</p>
              </div>
            </div>
            <div class="page-side back bg-[#FFB6C1]">
              <div class="spine-overlay-back"></div>
            </div>
          </div>

          <!-- Content Pages -->
          <div 
            v-for="(page, index) in pages" 
            :key="index"
            class="page"
            :class="{ 'flipped': index + 1 <= currentPage }"
            :style="{ 
              zIndex: index + 1 <= currentPage ? index + 1 : pages.length - index 
            }"
          >
            <!-- Page Front (Content) -->
            <div class="page-side front bg-white">
              <div class="p-12 h-full flex flex-col">
                <div class="mb-8">
                  <span class="text-xs font-black text-pink-400 uppercase tracking-widest mb-1 block">{{ page.chapter }}</span>
                  <h2 class="text-3xl font-black text-gray-800 tracking-tight">{{ page.title }}</h2>
                </div>
                
                <div class="flex-grow flex flex-col">
                  <div class="w-full h-72 mb-8 rounded-xl overflow-hidden shadow-md border border-gray-100">
                    <img :src="page.image" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-grow bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
                    <p class="text-lg leading-relaxed text-gray-700 font-medium">{{ page.content }}</p>
                  </div>
                </div>    
               
              </div>
            </div>
            
            <div class="page-side back bg-white">
              <div class="spine-overlay-back"></div>
            </div>
          </div>

          <!-- Back Cover -->
          <div 
            class="page cover-back" 
            :class="{ 'flipped': currentPage > pages.length }"
            :style="{ zIndex: currentPage > pages.length ? pages.length + 2 : 0 }"
          >
             <div class="page-side front bg-[#FFB6C1] flex items-center justify-center relative overflow-hidden">
                <div class="spine-overlay"></div>
                <div class="text-white/30 text-xs font-black tracking-[1em] uppercase -rotate-90">Sweetbook AI</div>
             </div>
             <div class="page-side back bg-[#FFB6C1]">
                <div class="spine-overlay-back"></div>
                <div class="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center relative overflow-hidden">
                  <div class="z-10">
                    <h1 class="text-4xl font-black mb-4 drop-shadow-lg tracking-tight leading-tight uppercase">The End</h1>
                    <div class="w-12 h-1 bg-white mx-auto mb-6 rounded-full"></div>
                    <p class="text-sm opacity-70">함께한 소중한 기록들</p>
                  </div>
                  <p class="absolute bottom-10 left-0 right-0 text-[8px] font-bold tracking-widest opacity-30 uppercase">© 2026 SONAKI</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <button 
      @click="$emit('next')" 
      class="flex-shrink-0 z-[200] p-4 rounded-full bg-white shadow-xl hover:bg-gray-50 hover:scale-110 transition-all disabled:opacity-0 disabled:pointer-events-none border border-gray-100"
      :disabled="currentPage > pages.length"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  pages: {
    type: Array,
    required: true
  },
  currentPage: Number
});

defineEmits(['next', 'prev']);
</script>

<style scoped>
.book-container {
  perspective: 2500px;
  width: 500px;
  height: 700px;
  position: relative;
  transition: width 0.8s cubic-bezier(0.15, 0, 0.15, 1);
}

.book-container.is-open {
  width: 1000px;
}

.book {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.15, 0, 0.15, 1);
  transform: translateX(0);
}

.book.is-flipped {
  transform: translateX(500px);
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
  transition: transform 1s cubic-bezier(0.15, 0, 0.15, 1);
}

.page.flipped {
  transform: rotateY(-180deg);
}

.page-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 0 8px 8px 0;
  box-shadow: inset -1px 0 2px rgba(0,0,0,0.05);
}

.page-side.back {
  transform: rotateY(180deg);
  border-radius: 8px 0 0 8px;
  box-shadow: inset 10px 0 30px rgba(0,0,0,0.05);
}

.cover-front {
  border-radius: 0 12px 12px 0;
  box-shadow: 15px 15px 40px rgba(0,0,0,0.2);
}

.cover-back {
  border-radius: 0 12px 12px 0;
}

.page.flipped.cover-front {
  box-shadow: none;
}

.page.flipped.cover-back {
  box-shadow: -15px 15px 40px rgba(0,0,0,0.2);
}

.spine-overlay {
  position: absolute;
  left: 0; top: 0; width: 30px; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.1) 100%);
  z-index: 20;
}

.spine-overlay-back {
  position: absolute;
  right: 0; top: 0; width: 30px; height: 100%;
  background: linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 100%);
  z-index: 20;
}
</style>


