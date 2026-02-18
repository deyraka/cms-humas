// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import DraftView from '../views/DraftView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/calendar',
//       name: 'contents calendar',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/CalendarView.vue'),
//     },
//     {
//       path: '/draft',
//       name: 'contents draft',
//       component: DraftView,
//     },
//   ],
// })

// export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores' // Import store Anda
import HomeView from '../views/HomeView.vue'
import DraftView from '../views/DraftView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: HomeView,
    },
    {
      path: '/',   // sementara kita langsung ke calendar aja dulu
      name: 'home',
      component: () => import('../views/CalendarView.vue'),
    },
    {
      path: '/draft',
      name: 'draft',
      component: DraftView,
      meta: { requiresAuth: true, roles: ['superadmin', 'konseptor', 'editor', 'statmin', 'kamedsos'] }
    },
    {
      path: '/contentForm',
      name: 'contentForm',
      component: () => import('../views/ContentForm.vue'),
      // meta: { requiresAuth: true, roles: ['superadmin', 'konseptor'] }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true, roles: ['superadmin'] }
    },
  ],
})

// --- Navigation Guard ---
router.beforeEach(async (to, from, next) => {
  // Pindahkan pemanggilan store ke dalam sini agar Pinia sudah siap
  const authStore = useAuthStore()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.meta.roles

  // 1. Jika rute TIDAK butuh auth (Home / Calendar), langsung izinkan
  if (!requiresAuth) {
    next()
    return
  }

  // 2. Jika butuh auth tapi TIDAK login
  if (requiresAuth && !authStore.isLoggedIn) {
    alert('Anda harus login untuk mengakses halaman ini!')
    next({ name: 'home' }) // Gunakan objek name agar lebih eksplisit
    return
  } 

  // 3. Jika login tapi ROLE tidak sesuai
  if (allowedRoles && !allowedRoles.includes(authStore.userRole)) {
    alert('Anda tidak memiliki akses ke halaman ini!')
    next({ name: 'home' })
    return
  }

  // 4. Jika semua lolos
  next()
})
// --- Navigation Guard ---
/* router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 1. Cek apakah rute memerlukan login
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // 2. Cek apakah rute memiliki batasan role
  const allowedRoles = to.meta.roles

  if (requiresAuth && !authStore.isLoggedIn) {
    // Jika butuh login tapi belum login, lempar ke Home atau panggil modal login
    alert('Anda harus login untuk mengakses halaman ini!')
    next('/')
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.userRole)) {
    // Jika sudah login tapi role tidak diizinkan
    alert('Anda tidak memiliki akses ke halaman ini!')
    next('/')
  } else {
    // Jika semua oke, lanjutkan navigasi
    next()
  }
}) */

export default router