import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore.js';
import { useDataStore } from '../store/dataStore.js';

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
    meta: { requiresAuth: true, requiresGroup: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/LogoutView.vue'),
  },
  {
    path: "/create-invoice",
    name: "CreateInvoice",
    component: () => import("../views/CreateInvoiceView.vue"),
    meta: { requiresAuth: true, requiresGroup: true }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: () => import("../views/InvoiceOverviewView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/review-invoice",
    name: "ReviewInvoice",
    component: () => import("../views/ReviewInvoiceView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/download-invoice",
    name: "DownloadInvoice",
    component: () => import("../views/DownloadInvoiceView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/administration",
    component: () => import("../views/AdministrationView.vue"),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: "/administration/members",
    component: () => import("../views/EditMembersView.vue"),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: "/administration/groups",
    component: () => import("../views/EditGroupsView.vue"),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: "/administration/users",
    component: () => import("../views/EditUsersView.vue"),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: "/administration/issues-overview",
    component: () => import("../views/IssuesOverviewView.vue"),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: "/editgroup",
    component: () => import("../views/EditGroupView.vue"),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
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
    if (await useAuthStore().authenticate()) {
      await useDataStore().getNotifications()
      next();
      return;
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

/**
 * Middleware: Wird ausgeführt bevor eine Unterseite aufgerufen wird.
 * Überprüft, ob für die Unterseite Zugriff auf mindestens eine Gruppe benötigt wird.
 * Wenn ja, wir überprüft, auf wie viele Gruppen ein User Zugriff hat.
 *    Wenn > 0, wird Unterseite angezeigt.
 *    Wenn == 0, wird router zu /profile weitergeleitet.
 * Wenn nicht, wird angefragte Unterseite angezeigt.
 */
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresGroup)) {
    if (useAuthStore().user?.lengthAccessibleGroups > 0) {
      next();
      return;
    } else {
      next("/profile");
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
    if (await useAuthStore().authenticate()) {
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
