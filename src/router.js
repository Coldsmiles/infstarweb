import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/announcements',
    name: 'announcements',
    component: () => import('./pages/AnnouncementsPage.vue'),
  },
  {
    path: '/facilities',
    name: 'facilities',
    component: () => import('./pages/FacilitiesPage.vue'),
  },
  {
    path: '/towns',
    name: 'towns',
    component: () => import('./pages/TownsPage.vue'),
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('./pages/StatsPage.vue'),
  },
  {
    path: '/sponsor',
    name: 'sponsor',
    component: () => import('./pages/SponsorPage.vue'),
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('./pages/JoinPage.vue'),
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => import('./pages/DocPage.vue'),
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('./pages/MapPage.vue'),
  },
  {
    path: '/photo',
    name: 'photo',
    component: () => import('./pages/PhotoPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

export default router;
