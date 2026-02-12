<template>
    <div class="drawer-side is-drawer-close:overflow-visible">
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
import { useAuthStore } from '@/stores'; // Sesuaikan path alias @/ atau ../
import { House, CalendarCheck, FileText, Settings, Users } from 'lucide-vue-next';

const authStore = useAuthStore();

// 1. Definisi menu lengkap
const menuItems = [
  { name: 'Home', path: '/home', icon: House, roles: ['guest', 'any'] },
  { name: 'Calendar', path: '/', icon: CalendarCheck, roles: ['guest', 'any'] },
  { name: 'Draft Konten', path: '/draft', icon: FileText, roles: ['superadmin', 'konseptor', 'editor', 'statmin', 'kamedsos'] },
  { name: 'Manajemen User', path: '/users', icon: Users, roles: ['superadmin'] },
  { name: 'Pengaturan', path: '/settings', icon: Settings, roles: ['superadmin'] },
];

// 3. Logika Filtering Menu (RBAC)
const filteredMenu = computed(() => {
  return menuItems.filter(item => {
    if (item.roles.includes('any')) return true;
    if (authStore.userRole === 'guest') {
      return item.roles.includes('guest');
    }
    return item.roles.includes(authStore.userRole);
  });
});
</script>