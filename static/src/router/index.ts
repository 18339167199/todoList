import { createRouter, createWebHistory } from 'vue-router'
import { isTokenEffective } from '@/utils/util'

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
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default router

router.beforeEach((to, form, next) => {
  if (!to.meta.requireAuth) {
    next()
    return
  }
  if (isTokenEffective()) {
    next()
  } else {
    next('/login')
  }
})
