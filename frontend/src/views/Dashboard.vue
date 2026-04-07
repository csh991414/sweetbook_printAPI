<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <header class="text-center mb-12">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          스마트 병영일기: 소나기 리부트
        </h1>
        <p class="mt-3 text-xl text-gray-500">
          군 생활의 모든 순간을 타임라인으로 기록하세요.
        </p>
      </header>

      <div class="relative">
        <!-- Vertical Line -->
        <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

        <div class="space-y-12">
          <div 
            v-for="(episode, index) in episodes" 
            :key="episode.id"
            class="relative flex items-center justify-between"
          >
            <!-- Timeline Dot -->
            <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white shadow" :class="episode.color"></div>

            <!-- Content Card -->
            <div 
              :class="[
                'w-5/12 p-6 rounded-xl shadow-lg bg-white transform transition duration-500 hover:scale-105',
                index % 2 === 0 ? 'mr-auto text-right' : 'ml-auto text-left'
              ]"
            >
              <span 
                class="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
                :class="episode.color"
              >
                {{ episode.tag }}
              </span>
              <h3 class="text-lg font-bold text-gray-900">{{ episode.title }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ episode.date }}</p>
              <p class="text-gray-600 text-sm leading-relaxed">{{ episode.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <button 
          @click="createBook"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          스위트북 제작하기 (API 연동)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MILITARY_EPISODES } from '../constants/data';

const episodes = MILITARY_EPISODES;

const createBook = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/books/auto-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '나의 병영일기: 소나기 리부트',
        episodes: episodes
      })
    });
    const data = await response.json();
    if (data.success) {
      alert(`책 제작이 완료되었습니다!\nBook UID: ${data.data.bookUid}\n페이지 수: ${data.data.pageCount}`);
    } else {
      alert('제작 실패: ' + (data.message || '알 수 없는 오류'));
    }
  } catch (err) {
    alert('에러 발생: ' + err.message);
  }
};
</script>
