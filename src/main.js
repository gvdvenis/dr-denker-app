import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import PuzzleGrid from './components/PuzzleGrid.vue'
import ImageZoomView from './components/ImageZoomView.vue'

const routes = [
  { path: '/', name: 'home', component: PuzzleGrid },
  { path: '/zoom/:imageId', name: 'zoom', component: ImageZoomView }
]

const router = createRouter({
  history: createWebHashHistory('/dr-denker-app/'),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
