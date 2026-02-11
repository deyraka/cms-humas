<template>
    <div class="drawer-side is-drawer-close:overflow-visible">
        <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        <!-- Sidebar content here -->
        <ul class="menu w-full grow">
            <!-- List item -->
            <li v-for="item in menuItems" :key="item.name">
                <button 
                    class="is-drawer-close:tooltip is-drawer-close:tooltip-right" 
                    :data-tip="item.name"
                >
                    <component 
                    :is="item.icon" 
                    class="my-1.5 inline-block size-4" 
                    />
                    
                    <span class="is-drawer-close:hidden">{{ item.name }}</span>
                </button>
            </li>
        </ul>
        </div>
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