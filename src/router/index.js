import { createRouter, createWebHashHistory } from 'vue-router';

import DefaultLayout from '@/views/dashboard/Main.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/pages/Login.vue'),
  },
  {
    path: '/signup', // 회원가입 경로 추가
    name: 'Signup',
    component: () => import('@/views/pages/Signup.vue'), // Signup.vue로 연결
  },
  {
    path: '/main',
    name: 'Main',
    component: DefaultLayout,
    meta: { requiresAuth: true },
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/dashboard/MapView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('@/views/charts/Registration.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/charts/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/userlist',
    name: 'UserList',
    component: () => import('@/views/charts/UserList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/modify',
    name: 'Modify',
    component: () => import('@/views/charts/Modify.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/delete',
    name: 'Delete',
    component: () => import('@/views/charts/Delete.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 인증 가드 추가
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null; // JWT 토큰이 있는지 확인

  // 인증이 필요한 페이지 접근 시
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/'); // 로그인 페이지로 리디렉션
  } else {
    next(); // 접근 허용
  }
});

export default router;
