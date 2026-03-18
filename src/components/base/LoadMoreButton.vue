<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  label: {
    type: String,
    default: '加载更多',
  },
});
</script>

<template>
  <div class="load-more-wrap">
    <BaseButton variant="ghost" size="md">
      {{ label }}
    </BaseButton>
  </div>
</template>

<style scoped>
.load-more-wrap {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>