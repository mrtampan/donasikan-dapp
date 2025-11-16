<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Toaster richColors/>
  </div>
</template>

<style scoped></style>
