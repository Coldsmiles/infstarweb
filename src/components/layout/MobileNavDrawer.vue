<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
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

const emit = defineEmits(['close']);
</script>

<template>
  <transition name="drawer-fade">
    <div v-if="open" class="mobile-drawer-mask" @click="emit('close')">
      <aside class="mobile-drawer" @click.stop>
        <div class="mobile-drawer__header">
          <p>站点导航</p>
          <button type="button" class="mobile-drawer__close" aria-label="关闭菜单" @click="emit('close')">
            ×
          </button>
        </div>
        <nav class="mobile-drawer__links" aria-label="移动端导航">
          <template v-for="item in items" :key="item.href">
            <a
              v-if="item.external"
              class="mobile-drawer__link"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              @click="emit('close')"
            >
              <span>{{ item.label }}</span>
            </a>
            <RouterLink
              v-else
              class="mobile-drawer__link"
              :to="item.href"
              @click="emit('close')"
            >
              <span>{{ item.label }}</span>
            </RouterLink>
          </template>
        </nav>
        <RouterLink class="mobile-drawer__cta" :to="ctaHref" @click="emit('close')">{{ ctaLabel }}</RouterLink>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.mobile-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(12px);
}

.mobile-drawer {
  width: min(360px, 100%);
  height: 100%;
  padding: 24px 20px 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: -20px 0 60px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
}

.mobile-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.mobile-drawer__header p {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bl-text-tertiary);
}

.mobile-drawer__close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bl-surface-muted);
  font-size: 1.4rem;
  cursor: pointer;
}

.mobile-drawer__links {
  display: grid;
  gap: 10px;
}

.mobile-drawer__link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border-radius: var(--bl-radius-md);
  background: #fff;
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.mobile-drawer__link span {
  font-weight: 600;
}

.mobile-drawer__link small {
  color: var(--bl-text-secondary);
}

.mobile-drawer__cta {
  margin-top: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}
</style>