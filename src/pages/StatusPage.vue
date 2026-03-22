<template>
  <iframe
    class="iframe-fullpage"
    src="https://api.infstar.cn/404.html"
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
