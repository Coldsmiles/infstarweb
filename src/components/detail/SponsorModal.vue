<script setup>
import BaseModal from '../base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  summary: {
    type: Object,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    width="680px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="sponsor-modal">
      <div class="sponsor-modal__icon">✦</div>
      <h3>{{ summary.title }}</h3>
      <p>{{ summary.description }}</p>
      <div class="sponsor-modal__stats">
        <div>
          <small>累计支持</small>
          <strong>{{ summary.total }}</strong>
        </div>
        <div>
          <small>活跃赞助者</small>
          <strong>{{ summary.supporters }}</strong>
        </div>
      </div>
      <div class="sponsor-modal__actions">
        <BaseButton variant="primary">查看赞助方式</BaseButton>
        <BaseButton variant="ghost">了解项目用途</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.sponsor-modal {
  text-align: center;
}

.sponsor-modal__icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: var(--bl-gold);
  background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.18), rgba(255, 255, 255, 0.9));
}

.sponsor-modal h3,
.sponsor-modal p {
  margin: 0;
}

.sponsor-modal p {
  max-width: 48ch;
  margin: 12px auto 0;
  color: var(--bl-text-secondary);
}

.sponsor-modal__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.sponsor-modal__stats div {
  padding: 20px;
  border-radius: 18px;
  background: rgba(245, 245, 247, 0.8);
}

.sponsor-modal__stats small,
.sponsor-modal__stats strong {
  display: block;
}

.sponsor-modal__stats small {
  color: var(--bl-text-secondary);
}

.sponsor-modal__stats strong {
  margin-top: 8px;
  font-size: 1.4rem;
}

.sponsor-modal__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 640px) {
  .sponsor-modal__stats {
    grid-template-columns: 1fr;
  }

  .sponsor-modal__actions {
    flex-direction: column;
  }
}
</style>