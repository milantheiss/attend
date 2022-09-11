import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: {guest: true}
  },
  {
    path: '/attendancelist',
    name: 'Attendance',
    component: () => import('../views/AttendanceListView.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/LogoutView.vue'),
  },
  {
    path: '/exportpdf',
    name: 'ExportPdf',
    component: () => import('../views/ExportPdf.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/attendancelist");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router
