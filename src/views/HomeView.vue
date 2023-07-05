<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <h1>Home</h1>
    <h4>Views</h4>
    <ul>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/about">About</router-link></li>
    </ul>
    <h4>Account</h4>
    <ul>
      <li><router-link to="/login">Login</router-link></li>
      <li><router-link to="/signup">Signup</router-link></li>
    </ul>
    <TheWelcome />
  </main>
</template>
