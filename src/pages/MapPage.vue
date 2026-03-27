<template>
  <iframe
    class="iframe-fullpage"
    src="http://202.189.7.160:50222/#world:0:0:0:500:0:0:0:1:flat"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<style scoped>
.iframe-fullpage {
  position: fixed;
  top: var(--bl-header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--bl-header-height));
  border: none;
}
</style>
