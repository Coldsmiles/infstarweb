<script setup>
const props = defineProps({
  brand: {
    type: String,
    default: '白鹿原',
  },
  year: {
    type: Number,
    default: new Date().getFullYear(),
  },
});

const footerLinks = [
  { label: '文档', href: '/doc.html' },
  { label: '地图', href: '/map.html' },
  { label: '赞助', href: '/sponsor.html' },
];
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner bl-shell">
      <div>
        <p class="site-footer__brand">{{ brand }}</p>
        <p class="site-footer__copy">© {{ year }} {{ brand }} Minecraft 服务器</p>
      </div>
      <nav class="site-footer__links" aria-label="页脚导航">
        <a v-for="link in footerLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 80px;
  padding: 28px 0 36px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
}

.site-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.site-footer__brand,
.site-footer__copy {
  margin: 0;
}

.site-footer__brand {
  font-size: 1.1rem;
  font-weight: 700;
}

.site-footer__copy {
  margin-top: 6px;
  color: var(--bl-text-secondary);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.site-footer__links a {
  color: var(--bl-text-secondary);
  text-decoration: none;
}

.site-footer__links a:hover {
  color: var(--bl-text);
}

@media (max-width: 720px) {
  .site-footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>