<template>
  <div class="card bg-base-100 card-xs shadow-sm border border-base-200">
    <div class="card-body py-2 px-4">
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <router-link to="/" class="flex items-center gap-1 hover:text-primary transition-colors">
              <House class="w-4 h-4" />
              <span v-if="route.path === '/'">Home</span>
            </router-link>
          </li>

          <template v-for="r in allRoutes" :key="r.path">
            <li v-if="route.path === r.path && r.path !== '/'" class="text-base-content/60">
              <span class="capitalize">{{ r.name }}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { House } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// Mengambil semua rute yang didefinisikan di router/index.js secara otomatis
const allRoutes = computed(() => router.getRoutes());
</script>

<style scoped>
.card-body {
  padding: 0.5rem 1rem;
}
</style>