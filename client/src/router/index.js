import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/attendancelist'
  },
  {
    path: '/attendancelist',
    name: 'attendance-list',
    component: () => import('../views/AttendanceListView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
