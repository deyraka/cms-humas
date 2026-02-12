<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <header class="navbar bg-base-100 shadow-md px-4">
        <Navbar />
      </header>

      <main class="p-4 flex flex-col min-h-screen">
        <!-- <Breadcrumb /> -->
        <Breadcrumb class="w-full text-xs mb-4"/>
        <!-- main content render here -->
        <div class="card w-full bg-base-100 card-xl shadow-sm mb-4 flex-1">
          <div class="card-body">
            <router-view />
          </div>
        </div>
        <!-- Footer -->
        <Footer />
      </main>
    </div>
    <Sidebar />
  </div>
</template>

<script setup>
import { Heart, PanelLeftOpen, LogIn, Search } from 'lucide-vue-next';
import Breadcrumb from './components/layout/Breadcrumb.vue';
import Navbar from './components/layout/Navbar.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Footer from './components/layout/Footer.vue';
import { useMetadataStatusStore } from '@/stores/metadataStatus';
import { onMounted } from 'vue';

const statusStore = useMetadataStatusStore();

onMounted(() => {
  // Load semua metadata status di awal aplikasi
  statusStore.fetchSettings();
});
</script>

<style>
/* Smooth transition untuk lebar sidebar */
.drawer-side ul {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>