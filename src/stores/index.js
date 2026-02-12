/* import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user_cms')) || null)

  const isLoggedIn = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const userName = computed(() => user.value?.nama || '')

  function login(userData) {
    user.value = userData
    localStorage.setItem('user_cms', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user_cms')
  }

  return { user, isLoggedIn, userRole, userName, login, logout }
}) */

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userName: localStorage.getItem('userName') || '',
    userRole: localStorage.getItem('userRole') || '',
    loading: false
  }),
  
  actions: {
    // Fungsi login yang akan dipanggil dari komponen
    async login(username, pin) {
      this.loading = true;
      
      return new Promise((resolve, reject) => {
        // --- MODE PRODUKSI (GAS) ---
        if (typeof google !== 'undefined') {
          google.script.run
            .withSuccessHandler((result) => {
              this.loading = false;
              if (result) {
                this.setSession(result.Nama, result.Role);
                resolve({ success: true });
              } else {
                resolve({ success: false, message: "Username atau PIN salah!" });
              }
            })
            .withFailureHandler((err) => {
              this.loading = false;
              reject(err);
            })
            .authenticateUser(username, pin);
        } 
        // --- MODE DEVELOPMENT (LOKAL) ---
        else {
          setTimeout(() => {
            this.loading = false;
            if (username === 'admin' && pin === '1234') {
              this.setSession('Admin Lokal', 'superadmin');
              resolve({ success: true });
            } else {
              resolve({ success: false, message: "User lokal: admin, pin: 1234" });
            }
          }, 1000);
        }
      });
    },

    setSession(name, role) {
      this.isLoggedIn = true;
      this.userName = name;
      this.userRole = role;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
    },

    logout() {
      this.isLoggedIn = false;
      this.userName = '';
      this.userRole = '';
      localStorage.clear();
      router.push('/');
    }
  }
});