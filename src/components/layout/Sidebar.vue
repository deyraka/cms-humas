<template>
  <div class="drawer-side is-drawer-close:overflow-visible z-[50]">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-300">
      <ul class="menu w-full grow gap-1 px-2 py-4">
        <li v-for="item in filteredMenu" :key="item.name">
          <router-link
            class="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center w-full"
            :data-tip="item.name"
            :to="item.path"
            active-class="bg-primary text-primary-content font-bold"
          >
            <component
              :is="item.icon"
              class="my-1.5 inline-block size-5"
            />
            <span class="is-drawer-close:hidden ml-2">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores'; 
import { House, CalendarCheck, FileText, Settings, Users } from 'lucide-vue-next';

const authStore = useAuthStore();

/**
 * 1. Definisi Menu Lengkap
 * - 'any': Bisa diakses siapa saja (Guest maupun Logged In)
 * - 'guest': Hanya muncul jika BELUM login
 * - Role spesifik: Hanya muncul jika role user sesuai di GAS
 */
const menuItems = [
  { name: 'Home', path: '/home', icon: House, roles: ['any'] },
  { name: 'Calendar', path: '/', icon: CalendarCheck, roles: ['any'] },
  { 
    name: 'Draft Konten', 
    path: '/draft', 
    icon: FileText, 
    roles: ['superadmin', 'konseptor', 'editor', 'statmin', 'kamedsos'] 
  },
  { 
    name: 'Manajemen User', 
    path: '/users', 
    icon: Users, 
    roles: ['superadmin'] 
  },
  { 
    name: 'Pengaturan', 
    path: '/settings', 
    icon: Settings, 
    roles: ['superadmin'] 
  },
];

/**
 * 2. Logika Filtering Menu (RBAC)
 * Reaktif terhadap perubahan di authStore
 */
const filteredMenu = computed(() => {
  return menuItems.filter(item => {
    // Jika menu ditandai 'any', tampilkan untuk semua
    if (item.roles.includes('any')) return true;

    // Jika menu butuh role spesifik, user harus login terlebih dahulu
    if (!authStore.isLoggedIn) {
      // Jika belum login, hanya tampilkan yang ada role 'guest' (jika Anda mendefinisikannya nanti)
      return item.roles.includes('guest');
    }

    // Jika login, cek apakah role user ada di daftar roles menu tersebut
    return item.roles.includes(authStore.userRole);
  });
});
</script>