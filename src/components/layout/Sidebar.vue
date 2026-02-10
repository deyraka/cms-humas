<template>
  <div class="drawer-side z-40">
    <label for="main-drawer" class="drawer-overlay"></label>
    <ul class="menu p-4 w-20 hover:w-64 transition-all duration-300 ease-in-out min-h-full bg-base-200 text-base-content border-r overflow-hidden group">
      <li v-for="item in menuItems" :key="item.path">
        <router-link :to="item.path" class="flex items-center gap-4 py-3">
          <component :is="item.icon" :size="24" />
          <span class="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {{ item.name }}
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { CalendarCheck, FileText, Settings, Users } from 'lucide-vue-next';

const menuItems = [
  { name: 'Calendar', path: '/', icon: CalendarCheck },
  { name: 'Draft Konten', path: '/content', icon: FileText },
  { name: 'Manajemen User', path: '/users', icon: Users },
  { name: 'Pengaturan', path: '/settings', icon: Settings },
];
</script>