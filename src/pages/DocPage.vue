<template>
  <iframe
    class="iframe-fullpage"
    src="https://schema.lunadeer.cn/public/libraries/wco40gb6blucloqv"
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
