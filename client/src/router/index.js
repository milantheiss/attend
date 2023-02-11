import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/attendancelist',
    name: 'Attendance',
    component: () => import('../views/AttendanceListView.vue'),
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: '/editgroup',
    name: 'EditGroup',
    component: () => import('../views/EditGroupView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/createInvoice",
    name: "CreateInvoice",
    component: () => import("../views/CreateInvoiceView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/openInvoices",
    name: "OpenInvoices",
    component: () => import("../views/OpenInvoicesView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/reviewInvoice",
    name: "ReviewInvoice",
    component: () => import("../views/ReviewInvoiceView.vue"),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Middleware: Wird ausgeführt bevor eine Unterseite aufgerufen wird.
 * Überprüft, ob Unterseite Authentication benötigt.
 * Wenn ja, wir überprüft, ob Session authentifiziert ist.
 *    Wenn ja, wird angefragte Unterseite angezeigt.
 *    Wenn nicht, wird router zu /login weitergeleitet.
 * Wenn nicht, wird angefragte Unterseite angezeigt.
 */
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (useAuthStore().authenticated) {
      await useDataStore().getNotifications()
      next();
      return;
    } else {
      if (await useAuthStore().authenticate()) {
        await useDataStore().getNotifications()
        next()
        return
      } else {
        next("/login");
      }
    }
  } else {
    next();
  }
});

/**
 * Middleware: Wird ausgeführt bevor eine Unterseite aufgerufen wird.
 * Überprüft, ob Unterseite für Gäste zugänglich ist.
 * Wenn ja, wir überprüft, ob Session authentifiziert ist.
 *    Wenn ja, wird router zu '/attendancelist' weitergeleitet.
 *    Wenn nicht, wird angefragte Unterseite angezeigt.
 * Wenn nicht, wird angefragte Unterseite angezeigt.
 */
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (useAuthStore().authenticated || await useAuthStore().authenticate()) {
      await useDataStore().getNotifications()
      next("/attendancelist");
      return;
    }
    next()
  } else {
    next();
  }
});

export default router
