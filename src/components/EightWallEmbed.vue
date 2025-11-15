<template>
  <div class="embed-container">
    <iframe
      src="https://studionode.8thwall.app/vps-tap-place/"
      allowfullscreen
      allow="camera; microphone; geolocation; accelerometer; magnetometer; gyroscope; autoplay; clipboard-read; clipboard-write; fullscreen"
      title="8th Wall Experience"
    ></iframe>
  </div>
</template>

<style scoped>
.embed-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.embed-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  display: block;
}
</style>
