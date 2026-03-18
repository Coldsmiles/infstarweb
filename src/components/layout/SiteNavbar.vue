<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import MobileNavDrawer from './MobileNavDrawer.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activePath: {
    type: String,
    default: '/',
  },
  logoSrc: {
    type: String,
    default: 'https://img.lunadeer.cn/i/2024/04/22/6625ce6c8ddc1.png',
  },
  logoAlt: {
    type: String,
    default: '白鹿原 Minecraft 服务器 Logo',
  },
  ctaLabel: {
    type: String,
    default: '加入游戏',
  },
  ctaHref: {
    type: String,
    default: '/join',
  },
});

const mobileOpen = ref(false);

const isActive = (href) => href === props.activePath;
</script>

<template>
  <header class="site-navbar">
    <div class="site-navbar__inner bl-shell">
      <button
        type="button"
        class="site-navbar__toggle"
        aria-label="打开菜单"
        @click="mobileOpen = true"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <RouterLink class="site-navbar__logo" to="/">
        <img :src="logoSrc" :alt="logoAlt">
      </RouterLink>

      <nav class="site-navbar__links" aria-label="主导航">
        <template v-for="item in items" :key="item.href">
          <a
            v-if="item.external"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="site-navbar__link"
          >{{ item.label }}</a>
          <RouterLink
            v-else
            :to="item.href"
            :class="['site-navbar__link', { 'is-active': isActive(item.href) }]"
          >{{ item.label }}</RouterLink>
        </template>
      </nav>

      <RouterLink class="site-navbar__cta" :to="ctaHref">{{ ctaLabel }}</RouterLink>
    </div>
  </header>

  <MobileNavDrawer
    :open="mobileOpen"
    :items="items"
    :cta-label="ctaLabel"
    :cta-href="ctaHref"
    @close="mobileOpen = false"
  />
</template>

<style scoped>
.site-navbar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1100;
  height: var(--bl-header-height);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(20px);
}

.site-navbar__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.site-navbar__toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.site-navbar__toggle span {
  width: 16px;
  height: 1.5px;
  background: var(--bl-text);
  border-radius: 999px;
}

.site-navbar__logo img {
  width: auto;
  height: 32px;
}

.site-navbar__links {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-left: auto;
  margin-right: 8px;
}

.site-navbar__link {
  position: relative;
  font-size: 0.82rem;
  color: rgba(29, 29, 31, 0.82);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-navbar__link:hover,
.site-navbar__link.is-active {
  color: var(--bl-text);
}

.site-navbar__link.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -12px;
  height: 2px;
  border-radius: 999px;
  background: var(--bl-text);
}

.site-navbar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 16px;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #fff;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: var(--bl-transition);
}

.site-navbar__cta:hover {
  background: var(--bl-accent-strong);
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .site-navbar__toggle {
    display: inline-flex;
  }

  .site-navbar__links,
  .site-navbar__cta {
    display: none;
  }

  .site-navbar__inner {
    justify-content: space-between;
  }
}
</style>