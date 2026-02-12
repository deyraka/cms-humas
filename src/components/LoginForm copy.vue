<template>
  <dialog id="login_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-sm mx-auto">
      <div class="flex flex-col items-center mb-6">
        <div class="p-3 bg-primary/10 rounded-full mb-2">
          <LogIn class="w-8 h-8 text-primary" />
        </div>
        <h3 class="font-bold text-lg text-base-content text-center">Login CMS Humas</h3>
        <p class="text-[10px] text-base-content/60 text-center uppercase tracking-widest font-semibold">Security Access</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col items-center">
        <div class="form-control w-full max-w-xs">
          <label class="label py-1"><span class="label-text font-bold text-xs">Username</span></label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" :size="16" />
            <input v-model="form.username" type="text" placeholder="Admin" class="input input-sm input-bordered w-full pl-9 bg-base-200 focus:input-primary transition-all" required />
          </div>
        </div>

        <div class="form-control w-full max-w-xs mt-2">
          <label class="label py-1"><span class="label-text font-bold text-xs">PIN</span></label>
          <div class="relative">
            <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" :size="16" />
            <input v-model="form.pin" type="password" placeholder="****" class="input input-sm input-bordered w-full pl-9 bg-base-200 focus:input-primary transition-all" required />
          </div>
        </div>

        <div class="modal-action flex flex-row justify-end gap-2 w-full max-w-xs mt-8">
          <button type="button" @click="closeModal" class="btn btn-sm btn-ghost flex-1">
            Batal
          </button>
          <button type="submit" :disabled="loading" class="btn btn-sm btn-primary flex-1 shadow-md">
            <span v-if="loading" class="loading loading-spinner loading-xs"></span>
            Login
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { LogIn, User, KeyRound } from 'lucide-vue-next';
import { useAuthStore } from '@/stores';
const authStore = useAuthStore();

const emit = defineEmits(['login-success', 'close']);
const loading = ref(false);
const form = reactive({ username: '', pin: '' });

const closeModal = () => {
  emit('close');
  const modal = document.getElementById('login_modal');
  if (modal) modal.close();
};

// const handleLogin = async () => {
//   loading.value = true;
//   try {
//     const response = await authUserGAS(form.username, form.pin);
    
//     if (response.status === 'success') {
//       const userData = {
//         id: response.data.id,
//         username: response.data.username,
//         nama: response.data.nama,
//         role: response.data.role
//       };
//       localStorage.setItem('user_cms', JSON.stringify(userData));
      
//       emit('login-success', userData);
//       form.username = '';
//       form.pin = '';
//     }
//   } catch (err) {
//     alert(err.message);
//   } finally {
//     loading.value = false;
//   }
// };
const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await authUserGAS(form.username, form.pin);
    if (response.status === 'success') {
      // Panggil Pinia Store
      authStore.login(response.data); 
      
      emit('login-success', response.data);
      form.username = '';
      form.pin = '';
    }
  } catch (err) {
    alert(err.message);
  } finally {
    loading.value = false;
  }
};

// Mockup GAS Function
const authUserGAS = (username, pin) => {
  return new Promise((resolve, reject) => {
    const users = [
      { id: 1, username: 'superadmin', pin: '1111', nama: 'Budi Santoso', role: 'superadmin' },
      { id: 2, username: 'editor', pin: '1111', nama: 'Siti Aminah', role: 'editor' },
      { id: 3, username: 'kahumas', pin: '1111', nama: 'Andi Wijaya', role: 'kahumas' },
      { id: 4, username: 'konseptor', pin: '1111', nama: 'Andi Wijaya', role: 'konseptor' },
      { id: 5, username: 'statmin', pin: '1111', nama: 'Andi Wijaya', role: 'statmin' },
      { id: 6, username: 'kepala', pin: '1111', nama: 'Andi Wijaya', role: 'kepala' },
      { id: 7, username: 'kabag', pin: '1111', nama: 'Andi Wijaya', role: 'kabag' },
      { id: 8, username: 'kamedsos', pin: '1111', nama: 'Andi Wijaya', role: 'kamedsos' },
      { id: 9, username: 'madya', pin: '1111', nama: 'Andi Wijaya', role: 'madya' }
    ];
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.pin === pin);
      user ? resolve({ status: 'success', data: user }) : reject({ status: 'error', message: 'Username atau PIN salah!' });
    }, 1200);
  });
};
</script>