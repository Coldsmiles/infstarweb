<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <section class="modal-section">
    <div class="modal-section__head">
      <h4>{{ title }}</h4>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="modal-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.modal-section {
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(245, 245, 247, 0.8);
}

.modal-section__head h4,
.modal-section__head p {
  margin: 0;
}

.modal-section__head p {
  margin-top: 6px;
  color: var(--bl-text-secondary);
  font-size: 0.85rem;
}

.modal-section__body {
  margin-top: 14px;
}
</style>