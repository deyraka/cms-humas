<template>
  <div class="navbar-start">
    <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
      <PanelLeftOpen class="w-6 h-6" />
    </label>
    <div class="hidden lg:block px-2 text-lg font-bold">CMS Humas Kalteng</div>
    <div class="block lg:hidden px-2 text-sm font-bold">CMS</div>
  </div>

  <div class="navbar-center">
    <div v-if="authStore.isLoggedIn" class="flex flex-col items-center animate-fade-in">
      <span class="hidden sm:block text-md font-medium">
        Halo, <span class="font-bold text-primary">{{ authStore.userName }}</span>
      </span>
      <span class="block sm:hidden text-xs font-medium">
        Halo, <span class="font-bold text-primary">{{ getFirstName(authStore.userName) }}</span>
      </span>
    </div>
  </div>

  <div class="navbar-end">
    <div class="flex items-center gap-1">
      
      <div :data-tip="isDarkMode ? 'Change to day mode' : 'Change to night mode'" 
            class="tooltip tooltip-bottom tooltip-primary">
        <label class="swap swap-rotate btn btn-ghost btn-circle btn-sm md:btn-md">
          <input type="checkbox" class="theme-controller" value="night" @change="isDarkMode = !isDarkMode" />
          <Sun class="swap-off w-5 h-5 md:w-6 md:h-6 fill-current"/>
          <Moon class="swap-on h-5 w-5 fill-current"/>
        </label>
      </div>

      <div class="hidden sm:block divider divider-horizontal mx-0"></div>

      <button v-if="!authStore.isLoggedIn" @click="openLoginModal" class="btn btn-ghost btn-sm md:btn-md gap-2">
        <LogIn class="w-5 h-5" />
        <span class="text-md font-semibold">Login</span>
      </button>

      <button v-else @click="handleLogout" class="btn btn-ghost btn-sm md:btn-md gap-2 text-error hover:bg-error/10">
        <LogOut class="w-5 h-5" />
        <span class="text-md font-semibold">Logout</span>
      </button>
    </div>
  </div>

  <LoginForm />
</template>

<script setup>
import { ref } from 'vue';
import { Sun, Moon, PanelLeftOpen, LogIn, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores'; 
import LoginForm from '../LoginForm.vue'; // Pastikan path benar

const authStore = useAuthStore();
const isDarkMode = ref(false);

// Logic memotong nama untuk mobile
const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

// Memicu modal daisyUI
const openLoginModal = () => {
  const modal = document.getElementById('login_modal');
  if (modal) modal.showModal();
};

// Logout menggunakan action dari Pinia
const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    authStore.logout();
    // Secara otomatis router-guard di router/index.js akan bekerja 
    // jika user sedang di halaman terproteksi
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>