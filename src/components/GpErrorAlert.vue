<template>
  <div
    v-if="isShown"
    class="gp-error-alert"
  >
    <span>{{ error && error.message }}</span>
    <span
      class="gp-error-alert-close"
      @click="isShown = false"
    >
      Close
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  error: {
    type: Error,
    default: null
  }
})

const isShown = ref(true)
</script>

<style>
.gp-error-alert {
  display: flex;
  justify-content: space-between;
  background: #e74c3c;
  color: #eee;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.gp-error-alert-close {
  cursor: pointer;
}
</style>
