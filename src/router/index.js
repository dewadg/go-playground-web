import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import AuthSuccess from '../pages/AuthSuccess.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:shareId?',
      name: 'home',
      component: Home
    },
    {
      path: '/auth/success',
      name: 'auth.success',
      component: AuthSuccess
    }
  ]
})
