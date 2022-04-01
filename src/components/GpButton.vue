<template>
  <button
    class="gp-button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])

function handleClick (e) {
  e.preventDefault()

  emit('click')
}
</script>

<style lang="scss">
.gp-button {
  background: #fff;
  border: 1px solid #888;
  border-bottom: 2px solid #888;
  font-size: 1.1rem;
  font-family: 'Patrick Hand', sans-serif;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
}
</style>
