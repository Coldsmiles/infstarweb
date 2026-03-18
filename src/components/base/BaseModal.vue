<script setup>
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '760px',
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    close();
  }
};

watch(
  () => props.modelValue,
  (open) => {
    document.body.classList.toggle('bl-modal-open', open);
    if (open) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.classList.remove('bl-modal-open');
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="base-modal" @click="close">
        <div class="base-modal__dialog" :style="{ maxWidth: width }" @click.stop>
          <button type="button" class="base-modal__close" aria-label="关闭弹窗" @click="close">×</button>
          <header v-if="title || subtitle || $slots.header" class="base-modal__header">
            <slot name="header">
              <h3 v-if="title">{{ title }}</h3>
              <p v-if="subtitle">{{ subtitle }}</p>
            </slot>
          </header>
          <section class="base-modal__body">
            <slot />
          </section>
          <footer v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.base-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  padding: 40px 16px;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(10px);
}

.base-modal__dialog {
  position: relative;
  width: min(100%, var(--bl-content-width));
  max-height: min(90vh, 980px);
  overflow: auto;
  border-radius: var(--bl-radius-xl);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 250, 252, 0.98));
  box-shadow: var(--bl-shadow-modal);
}

.base-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  color: var(--bl-text);
  font-size: 1.3rem;
  cursor: pointer;
}

.base-modal__header {
  padding: 28px 30px 0;
}

.base-modal__header h3,
.base-modal__header p {
  margin: 0;
}

.base-modal__header h3 {
  font-size: 1.55rem;
  font-weight: 700;
}

.base-modal__header p {
  margin-top: 8px;
  color: var(--bl-text-secondary);
}

.base-modal__body {
  padding: 24px 30px 30px;
}

.base-modal__footer {
  padding: 0 30px 30px;
}

@media (max-width: 720px) {
  .base-modal {
    padding: 18px 10px;
  }

  .base-modal__header,
  .base-modal__body,
  .base-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>