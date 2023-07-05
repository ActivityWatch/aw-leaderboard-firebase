<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <h1 class="my-3">Welcome to the ActivityWatch Leaderboard</h1>
    <p>
      Here you can share your ActivityWatch-collected screentime with your friends, or compete
      against strangers with our <a href="/leaderboard">leaderboard</a>.
    </p>
    <p>
      ActivityWatch is an open-source time-tracking application that helps you understand how you
      spend your time.
    </p>

    <h2>Navigation</h2>
    <ul>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/about">About</router-link></li>
    </ul>
    <hr />
    <div style="padding: 3em">
      <TheWelcome />
    </div>
  </main>
</template>
