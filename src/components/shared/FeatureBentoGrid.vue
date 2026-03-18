<script setup>
import FeatureBentoCard from './FeatureBentoCard.vue';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="feature-bento-grid">
    <FeatureBentoCard v-for="item in items" :key="item.title" :item="item" />
  </div>
</template>

<style scoped>
.feature-bento-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.feature-bento-grid :deep(.feature-bento-card--large) {
  grid-column: span 2;
  grid-row: span 2;
}

.feature-bento-grid :deep(.feature-bento-card--medium) {
  grid-column: span 2;
}

@media (max-width: 960px) {
  .feature-bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature-bento-grid :deep(.feature-bento-card--large),
  .feature-bento-grid :deep(.feature-bento-card--medium) {
    grid-column: span 1;
    grid-row: span 1;
  }
}

@media (max-width: 640px) {
  .feature-bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>