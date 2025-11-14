import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ARView from '@/views/ARView.vue'
import ModelLibraryView from '@/views/ModelLibraryView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/ar/:vpsLocationId?',
    name: 'ar',
    component: ARView,
    props: true
  },
  {
    path: '/models',
    name: 'models',
    component: ModelLibraryView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
