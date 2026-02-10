<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="card w-full bg-base-100 shadow-lg p-6">
    <div class="card-body items-center sm:items-start">
      <h1 class="card-title text-3xl text-primary">{{ msg }}</h1>
      <p class="text-base-content/80 max-w-prose">
        You’ve successfully created a project with
        <a class="link link-primary" href="https://vite.dev/" target="_blank" rel="noopener">Vite</a>
        +
        <a class="link link-primary" href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      </p>
      <div class="card-actions">
        <a class="btn btn-primary" href="https://vite.dev/" target="_blank" rel="noopener">Learn Vite</a>
        <a class="btn btn-ghost" href="https://vuejs.org/" target="_blank" rel="noopener">Learn Vue</a>
      </div>
    </div>
  </div>
</template>
