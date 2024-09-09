import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/views/dashboard/Main.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component:() => import('@/views/pages/Login.vue'),
  },
  {
    path: '/main',
    name: 'Main',
    component: DefaultLayout,
    //meta: { requiresAuth: true }
  },
  {
    path: '/map', // 최상위 경로로 이동
    name: 'Map',
    component: () => import('@/views/dashboard/MapView.vue'),
   // meta: { requiresAuth: true }
  },
  {
    path: '/registration', // 최상위 경로로 이동
    name: 'Registration',
    component: () => import('@/views/charts/Registration.vue'),
    //meta: { requiresAuth: true }
  },
  {
    path: '/list', // 최상위 경로로 이동
    name: 'List',
    component: () => import('@/views/charts/List.vue'),
    //meta: { requiresAuth: true }
  },
  {
    path: '/modify', // 최상위 경로로 이동
    name: 'Modify',
    component: () => import('@/views/charts/Modify.vue'),
    //meta: { requiresAuth: true }
  },
  {
    path: '/delete', // 최상위 경로로 이동
    name: 'Delete',
    component: () => import('@/views/charts/Delete.vue'),
    //meta: { requiresAuth: true }
  },
  
    
  
]


const router = createRouter({
  history: createWebHashHistory(), // BASE_URL 제거
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
// 인증 가드 추가
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = true; // 여기에 실제 인증 상태 확인 로직 추가
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/');
//   } else {
//     next();
//   }
// });

export default router
