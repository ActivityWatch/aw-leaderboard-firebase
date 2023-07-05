import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginForm from '@/components/LoginForm.vue'
import SignupForm from '@/components/SignupForm.vue'
import Dashboard from '@/components/Dashboard.vue'
import Leaderboard from '@/components/Leaderboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'Signup', component: SignupForm },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/leaderboard', name: 'Leaderboard', component: Leaderboard }
  ]
})

export default router
