<template>
  <dialog id="login_modal" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-lg mb-4 text-center">Login CMS Humas</h3>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Username</span></label>
          <input v-model="form.username" type="text" placeholder="Masukkan username" class="input input-bordered w-full" :disabled="authStore.loading" />
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text">PIN</span></label>
          <input v-model="form.pin" type="password" placeholder="****" class="input input-bordered w-full" :disabled="authStore.loading" @keyup.enter="handleLogin" />
        </div>

        <div v-if="errorMessage" class="text-error text-xs italic">{{ errorMessage }}</div>

        <div class="modal-action flex flex-col gap-2">
          <button @click="handleLogin" class="btn btn-primary w-full" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="loading loading-spinner"></span>
            {{ authStore.loading ? 'Mengecek...' : 'Login' }}
          </button>
          <form method="dialog">
            <button class="btn btn-ghost w-full" :disabled="authStore.loading">Batal</button>
          </form>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const errorMessage = ref('');
const form = reactive({
  username: '',
  pin: ''
});

const handleLogin = async () => {
  if (!form.username || !form.pin) {
    errorMessage.value = "Username dan PIN wajib diisi!";
    return;
  }

  try {
    const result = await authStore.login(form.username, form.pin);
    if (result.success) {
      errorMessage.value = '';
      form.username = '';
      form.pin = '';
      // Tutup modal secara manual
      document.getElementById('login_modal').close();
    } else {
      errorMessage.value = result.message;
    }
  } catch (err) {
    errorMessage.value = "Terjadi kesalahan koneksi ke server.";
  }
};
</script>