<script setup>
defineProps({
  option: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button type="button" :class="['playstyle-card', { 'is-selected': selected }]">
    <div class="playstyle-card__header">
      <span class="playstyle-card__icon">{{ option.icon }}</span>
      <strong>{{ option.name }}</strong>
    </div>
    <p>{{ option.description }}</p>
  </button>
</template>

<style scoped>
.playstyle-card {
  display: grid;
  gap: 14px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  cursor: pointer;
  transition: var(--bl-transition);
  text-align: left;
}

.playstyle-card:hover,
.playstyle-card.is-selected {
  transform: translateY(-2px);
  border-color: rgba(0, 113, 227, 0.35);
  box-shadow: var(--bl-shadow-soft);
}

.playstyle-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.playstyle-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(0, 113, 227, 0.08);
  color: var(--bl-accent);
}

.playstyle-card p {
  margin: 0;
  color: var(--bl-text-secondary);
}
</style>