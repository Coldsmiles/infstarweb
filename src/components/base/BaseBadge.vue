<script setup>
defineProps({
  tone: {
    type: String,
    default: 'neutral',
  },
  size: {
    type: String,
    default: 'md',
  },
});
</script>

<template>
  <span :class="['base-badge', `base-badge--${tone}`, `base-badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  font-weight: 700;
  white-space: nowrap;
}

.base-badge--sm {
  min-height: 22px;
  padding: 0 9px;
  font-size: 0.7rem;
}

.base-badge--md {
  min-height: 26px;
  padding: 0 11px;
  font-size: 0.76rem;
}

.base-badge--neutral {
  background: #f1f2f4;
  color: var(--bl-text-secondary);
}

.base-badge--accent {
  background: rgba(0, 113, 227, 0.12);
  color: var(--bl-accent-strong);
}

.base-badge--success {
  background: #e8fceb;
  color: #15803d;
}

.base-badge--warning {
  background: #fff7db;
  color: #b45309;
}

.base-badge--danger {
  background: #feebeb;
  color: #b91c1c;
}

.base-badge--purple {
  background: #f3f0ff;
  color: #6d28d9;
}
</style>