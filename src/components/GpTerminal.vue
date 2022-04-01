<template>
  <div class="gp-terminal">
    <span>Press run to execute code</span>
    <span>Execution error</span>
  </div>
</template>

<script setup>
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
