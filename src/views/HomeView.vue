<template>
  <AWLHeader />
  <main>
    <div style="max-width: 50em; margin: 5em auto">
      <h1 class="mb-3 mt-5">Welcome to the ActivityWatch Leaderboard</h1>
      <p>
        Here you can share your ActivityWatch-collected screentime with your friends, or compete
        against others on our <a href="/leaderboard">leaderboard</a>.
      </p>
      <p>
        <a href="https://activitywatch.net/">ActivityWatch</a> is an open-source time-tracking
        application that helps you understand how you spend your time.
      </p>
    </div>

    <div class="row">
      <div class="col-md-6">
        <h3>New to ActivityWatch?</h3>
        <p>
          If you're new to ActivityWatch, you can get started by downloading the ActivityWatch
          application from <a href="https://activitywatch.net/">activitywatch.net</a> and following
          the
          <a href="https://docs.activitywatch.net/en/latest/getting-started.html"
            >Getting started guide</a
          >.
        </p>
      </div>

      <div class="col-md-6">
        <h3>Existing ActivityWatch user?</h3>
        <p>
          This website is not quite ready yet, so unless you want to help in development, you should
          check back later!
        </p>
      </div>
    </div>

    <hr />

    <h2>Work in progress</h2>
    <p>
      This website is still in development, and is not yet ready for public use. You're free to look
      around though!
    </p>
    <p>
      You can contribute to the development of this website on
      <a href="https://github.com/ActivityWatch/aw-leaderboard-firebase">GitHub</a>.
    </p>

    <hr />

    <h2>Navigation</h2>
    <ul>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/about">About</router-link></li>
    </ul>
  </main>
</template>

<script lang="ts">
import AWLHeader from '@/components/Header.vue'
export default {
  name: 'AWLHomeView',
  components: {
    AWLHeader
  }
}
</script>