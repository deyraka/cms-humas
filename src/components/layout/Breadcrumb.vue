<template>
    <div class="card bg-base-100 card-xs shadow-sm">
        <div class="card-body items-center text-center">
            <div class="breadcrumbs text-sm">
                <ul>
                    <li><a><House class="w-4 h-4" /></a></li>
                    <li>Calendar</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { House, LogIn, LogOut, Search } from 'lucide-vue-next';
// Logika Pinia bisa dimasukkan di sini nanti
// const props = defineProps(['isLoggedIn', 'userName']);
// const emit = defineEmits(['toggleAuth']);

// const toggleAuth = () => emit('toggleAuth');
</script>