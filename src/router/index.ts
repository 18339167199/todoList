import { createRouter, createWebHistory } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue'),
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "LoginView" */ '@/views/LoginAndRegisterView.vue'),
      meta: {
        requireAuth: false,
      }
    },
    {
      path: '/todo/:id',
      name: 'todo',
      component: () => import(/* webpackChunkName: "RegisterView" */ '@/views/TodoView.vue'),
      meta: {
        requireAuth: true,
      }
    },
    { 
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default router
