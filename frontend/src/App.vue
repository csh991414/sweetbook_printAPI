<template>
  <div class="min-h-screen bg-[#F5F5F5] flex flex-col font-sans text-gray-800">
    <!-- Top Navigation -->
    <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 z-50 sticky top-0 shadow-sm">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-black text-indigo-600">AI</span>
          <span class="text-xl font-bold tracking-tighter text-gray-900">STORYCLASS</span>
        </div>
        <div class="h-6 w-px bg-gray-200"></div>
        <div class="flex items-center">
          <span class="text-sm font-bold text-gray-400">SWEETBOOK</span>
        </div>
      </div>
      
      <div class="hidden md:flex items-center space-x-8">
        <nav class="flex space-x-6 text-[13px] font-bold text-gray-500">
          <a href="#" class="hover:text-indigo-600 transition">SERVICE</a>
          <a href="#" class="hover:text-indigo-600 transition text-indigo-600 underline underline-offset-8">GALLERY</a>
          <a href="#" class="hover:text-indigo-600 transition">MY CLASS</a>
          <a href="#" class="hover:text-indigo-600 transition">MY BOOK</a>
        </nav>
        <div class="flex items-center space-x-4 ml-4">
          <button class="text-xs font-bold text-gray-400 hover:text-gray-900">LOGIN</button>
          <button class="text-xs font-bold text-gray-400 hover:text-gray-900">JOIN</button>
          <button class="px-4 py-2 border-2 border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition">CS CENTER</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center py-12 px-6">
      <!-- Book Header Info -->
      <div class="max-w-4xl w-full text-center mb-10">
        <h2 class="text-4xl font-black text-gray-900 mb-2 tracking-tight">Dino Liah!!</h2>
        <div class="flex items-center justify-center space-x-3 text-gray-400 font-bold text-sm">
          <span>Written by Liah Jang</span>
          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>March 2026</span>
        </div>
      </div>

      <!-- Book Viewer Wrapper -->
      <div class="relative w-full max-w-5xl flex justify-center items-center py-8">
        <BookViewer 
          :pages="pages" 
          :currentPage="currentPage" 
          @next="nextPage" 
          @prev="prevPage" 
        />
      </div>

      <!-- Book Action Buttons -->
      <div class="flex space-x-4 mt-12">
        <button class="px-8 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition">SHARE</button>
        <button class="px-10 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">ORDER PRINT</button>
      </div>

      <!-- Detailed Info Section -->
      <div class="max-w-4xl w-full mt-24 bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <h3 class="text-xl font-black mb-8 pb-4 border-b border-gray-50">Book Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div class="space-y-4">
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">TITLE</span>
              <span class="font-bold text-gray-900">Dino Liah!!</span>
            </div>
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">AUTHOR</span>
              <span class="font-bold text-gray-900">Liah Jang</span>
            </div>
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">DATE</span>
              <span class="font-bold text-gray-900">2026. 03. 15</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">PUBLISHER</span>
              <span class="font-bold text-gray-900 text-indigo-600 italic">Sweetbook AI</span>
            </div>
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">PAGES</span>
              <span class="font-bold text-gray-900">12 Pages</span>
            </div>
            <div class="flex">
              <span class="w-24 font-bold text-gray-400">TAGS</span>
              <div class="flex gap-2">
                <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">Dinosaur</span>
                <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">Fantasy</span>
                <span class="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">Kids</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-500 py-16 px-12 border-t border-gray-800">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div class="flex items-center space-x-2 mb-8 grayscale opacity-50">
            <span class="text-xl font-black text-white tracking-tighter uppercase">Sweetbook</span>
          </div>
          <p class="text-xs leading-loose max-w-md mb-8">
            (주)스위트북 | 서울특별시 성동구 성수이로 113, 8층(성수동2가, 제강빌딩) <br/>
            대표이사: 박순태 | 사업자등록번호: 211-88-82606 | 통신판매업신고번호: 제2012-서울성동-0775호 <br/>
            고객센터: 02-1234-5678 | 이메일: support@sweetbook.com
          </p>
          <div class="flex space-x-6 text-[11px] font-bold">
            <a href="#" class="hover:text-white transition">TERMS OF SERVICE</a>
            <a href="#" class="text-gray-300 hover:text-white transition">PRIVACY POLICY</a>
          </div>
        </div>
        <div class="lg:text-right flex flex-col justify-end">
          <p class="text-[10px] tracking-widest uppercase opacity-30">© 2026 SWEETBOOK AI ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DINO_LIAH_PAGES } from './constants/data';
import BookViewer from './components/BookViewer.vue';

const pages = ref(DINO_LIAH_PAGES);
const currentPage = ref(0);

const nextPage = () => {
  if (currentPage.value < pages.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};
</script>

<style>
/* Global styles for smoother experience */
body {
  @apply bg-[#F5F5F5] antialiased;
}

::selection {
  @apply bg-indigo-100 text-indigo-900;
}
</style>
