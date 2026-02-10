<template>
  <header class="navbar bg-base-100 shadow-md px-4">
    <div class="navbar-start">
      <div class="flex items-center gap-2">
        <Menu tabindex="0" role="button" class="w-6 h-6 btn btn-ghost btn-circle"/>
        <a class="btn btn-ghost text-xl">
          <span class="inline sm:hidden">CMS</span>
          <span class="hidden sm:inline">CMS - Humas Kalteng</span>
        </a>
      </div>
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
  </header>

  <main class="p-4">
    <!-- <Navbar /> -->
    <router-view />
  </main>
</template>

<script setup>
import { Menu, LogIn, Search } from 'lucide-vue-next';
// import Navbar from './components/layout/Navbar.vue';
// import Sidebar from './components/layout/Sidebar.vue';
// import { useAuthStore } from './stores/auth'; // Contoh store Pinia

// Commented out because `useAuthStore` is not imported in this file
// const authStore = useAuthStore();
</script>

<style>
/* Smooth transition untuk lebar sidebar */
.drawer-side ul {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>