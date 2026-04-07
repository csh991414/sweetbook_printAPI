import { createApp } from 'vue'
import './index.css' // ⭐ 이 줄이 없으면 테일윈드가 절대 안 먹힙니다!
import App from './App.vue'

createApp(App).mount('#app')
