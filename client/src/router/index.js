import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AttendanceListView from "@/views/AttendanceListView";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/attendance-list",
    name: "attendancelist",
    component: AttendanceListView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
