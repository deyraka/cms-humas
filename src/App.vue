<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <header class="navbar bg-base-100 shadow-md px-4">
        <Navbar />
      </header>

      <main class="p-4">
        <!-- <Navbar /> -->
        <Breadcrumb class="w-full text-xs"/>
        <router-view />
      </main>
    </div>
    <Sidebar />
  </div>
</template>

<script setup>
import { PanelLeftOpen, LogIn, Search } from 'lucide-vue-next';
import Breadcrumb from './components/layout/Breadcrumb.vue';
import Navbar from './components/layout/Navbar.vue';
import Sidebar from './components/layout/Sidebar.vue';
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