<script setup>
defineProps({
  device: {
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
  <button type="button" :class="['device-card', { 'is-selected': selected }]">
    <span class="device-card__icon">{{ device.icon }}</span>
    <strong>{{ device.name }}</strong>
    <small>{{ device.description }}</small>
  </button>
</template>

<style scoped>
.device-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 180px;
  padding: 26px 18px;
  border-radius: 18px;
  border: 2px solid #f5f5f7;
  background: #fff;
  cursor: pointer;
  transition: var(--bl-transition);
  text-align: center;
}

.device-card:hover,
.device-card.is-selected {
  border-color: var(--bl-accent);
  transform: translateY(-2px);
}

.device-card.is-selected {
  background: rgba(0, 113, 227, 0.03);
}

.device-card__icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f5f5f7;
  font-size: 1.4rem;
}

.device-card.is-selected .device-card__icon {
  background: var(--bl-accent);
  color: #fff;
}

.device-card small {
  color: var(--bl-text-secondary);
}
</style>