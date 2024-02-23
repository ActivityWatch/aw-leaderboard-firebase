<template>
  <AWLHeader />
  <div class="container">
    <div>
      <h1>About this website</h1>
      <p>
        This website is a place where users of the local-first software ActivityWatch can share
        their data with each other. Such that they can compete on public leaderboards, share data
        with their friends (coming later), and contribute to research (coming later).
      </p>
      <p>
        It serves as a social feature for ActivityWatch, allowing users to share what they are
        doing, without revealing the details by categorizing events locally before upload.
      </p>
    </div>

    <div>
      <h1>About ActivityWatch</h1>
      <p>
        ActivityWatch is a local-first privacy-focused open-source time-tracking software. It tracks
        what you do on your computer and stores it in a local database. It is available for Windows,
        macOS and Linux.
      </p>
      <p>
        There is an Android version, but it is currently not well maintained and is unavailable on
        latest Android,
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import AWLHeader from '@/components/Header.vue'
export default {
  name: 'AWLAboutView',
  components: {
    AWLHeader
  }
}
</script>