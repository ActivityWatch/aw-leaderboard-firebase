<template>
  <main>
    <h1 class="my-3">Welcome to the ActivityWatch Leaderboard</h1>
    <p>
      Here you can share your ActivityWatch-collected screentime with your friends, or compete
      against strangers with our <a href="/leaderboard">leaderboard</a>.
    </p>
    <p>
      <a href="https://activitywatch.net/">ActivityWatch</a> is an open-source time-tracking
      application that helps you understand how you spend your time.
    </p>

    <h2>Work in progress</h2>
    <p>
      This website is still in development, and is not yet ready for public use. You're free to look
      around though!
    </p>
    <p>
      You can also contribute to the development of this website on
      <a href="https://github.com/ActivityWatch/aw-leaderboard-firebase">GitHub</a>.
    </p>

    <h2>Navigation</h2>
    <ul>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/about">About</router-link></li>
    </ul>
  </main>
</template>
