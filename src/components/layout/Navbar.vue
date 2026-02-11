<template>
    <div class="navbar-start">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <!-- Sidebar toggle icon -->
        <PanelLeftOpen class="w-6 h-6" />
        </label>
        <div class="hidden sm:block px-2 text-lg">CMS Humas Kalteng</div>
        <div class="block sm:hidden px-2 text-sm">CMS</div>
    </div>
    <div class="navbar-end">
        <div class="flex items-center gap-3">
        <div class="hidden sm:block divider divider-horizontal"></div>
        <button class="btn btn-ghost gap-2">
            <LogIn class="w-5 h-5" />
            <span class="text-md font-semibold">Login</span>
        </button>
        </div>
    </div>
</template>

<script setup>
import { PanelLeftOpen, LogIn, LogOut, Search } from 'lucide-vue-next';
// Logika Pinia bisa dimasukkan di sini nanti
// const props = defineProps(['isLoggedIn', 'userName']);
// const emit = defineEmits(['toggleAuth']);

// const toggleAuth = () => emit('toggleAuth');
</script>