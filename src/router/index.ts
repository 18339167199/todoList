import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "LoginView" */ '@/views/LoginAndRegisterView.vue')
    },
    {
      path: '/todo/:id',
      name: 'todo',
      component: () => import(/* webpackChunkName: "RegisterView" */ '@/views/TodoView.vue')
    },
    { 
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default router
