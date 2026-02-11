<script setup>
import { Heart } from 'lucide-vue-next';
</script>

<template>
    <footer class="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-2">
        <div class="items-center grid-flow-col">
            <p>Copyright © {{new Date().getFullYear()}} <br> Build with <Heart class="inline-block w-4 h-4 text-red-500"/> by Tim TI BPS Kalteng (deyraka)</p>
        </div>
    </footer>
</template>