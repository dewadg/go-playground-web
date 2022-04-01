<template>
  <div class="gp-terminal">
    <span v-if="empty && !result.loading">Press run to execute code</span>
    <span v-if="result.loading">Running your code...</span>
    <span
      v-for="item in result.output"
    >
      {{ item }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
})

const empty = computed(_ => !props.result.error && props.result.output.length === 0)
</script>

<style lang="scss">
.gp-terminal {
  display: flex;
  flex-direction: column;
  background: #222;
  border-radius: 0.5rem;
  border: 1px solid #111;
  color: #eee;
  box-sizing: border-box;
  padding: 0.5rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  min-height: 120px;

  span {
    margin-bottom: 0.5rem;
  }
}
</style>
