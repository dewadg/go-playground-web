<template>
  <div class="gp-shareable">
    <input
      type="url"
      :value="link"
    >
    <button @click="handleCopy">
      Copy
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  link: {
    type: String,
    required: true
  }
})

function handleCopy () {
  navigator.clipboard.writeText(props.link)
}
</script>

<style lang="scss">
.gp-shareable {
  display: flex;
  align-items: center;
  font-family: 'Patrick Hand', sans-serif;

  input {
    min-width: 180px;
    background: #efefef;
    height: 100%;
    border: 0;
    outline: 0;
    font-size: 13px;
    font-family: inherit;
    border: 1px solid #888;
    border-bottom: 2px solid #888;
    border-right: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    padding: 0.25rem 0.75rem;
  }

  button {
    height: 100%;
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: 1.1rem;
    cursor: pointer;
    border: 1px solid #888;
    border-bottom: 2px solid #888;
    box-sizing: border-box;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 0.25rem 0.75rem;

    &:hover {
       background: #eee;
     }
  }
}
</style>
