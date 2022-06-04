<template>
  <router-link
    :to="{ name: 'home' }"
    class="gp-playground-title"
  >
    <h1
      :class="{
        'center': textAlign === 'center'
      }"
    >Go Playground</h1>
  </router-link>
</template>

<script setup>
defineProps({
  textAlign: {
    type: String,
    default: 'left'
  }
})
</script>

<style lang="scss">
.gp-playground-title {
  color: inherit;
  text-decoration: none;

  h1 {
    margin: 0 0 1rem 0;
    padding: 0.5rem 0 0 0;
    font-weight: normal;
    font-size: 2rem;

    &.center {
      text-align: center;
    }
  }
}
</style>
