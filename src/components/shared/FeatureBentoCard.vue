<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article :class="['feature-bento-card', `feature-bento-card--${item.size}`]" :style="{ background: item.background }">
    <div class="feature-bento-card__overlay"></div>
    <div class="feature-bento-card__content">
      <div class="feature-bento-card__icon">{{ item.icon }}</div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </article>
</template>

<style scoped>
.feature-bento-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  min-height: 220px;
  color: #fff;
  box-shadow: var(--bl-shadow-card);
}

.feature-bento-card--small {
  min-height: 180px;
}

.feature-bento-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(15, 23, 42, 0.3));
}

.feature-bento-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
  padding: 24px;
}

.feature-bento-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.14);
  font-size: 1.2rem;
}

.feature-bento-card h3,
.feature-bento-card p {
  margin: 0;
}

.feature-bento-card p {
  max-width: 28ch;
  color: rgba(255, 255, 255, 0.82);
}
</style>