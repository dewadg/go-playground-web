<template>
  <div class="gp-editor">
    <div
      id="gp-editor-lines-target"
      class="gp-editor-lines"
      :style="{
        'margin-top': `${scrollIndex}px`
      }"
    >
      <span
        v-for="i in lines"
        :key="i"
      >
        {{ i }}
      </span>
    </div>
    <textarea
      id="gp-editor-target"
      :disabled="disabled"
      @input="handleContentChange"
      @keydown.tab="handleTab"
      @scroll="handleTextareaScroll"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const scrollIndex = ref(0)

const content = computed({
  get: _ => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const lines = computed(() => content.value.split('\n').length)

onMounted(() => {
  const target = document.getElementById('gp-editor-target')

  target.value = content.value
  target.selectionEnd = 43
  target.focus()
})

function handleContentChange (e) {
  e.preventDefault()

  content.value = e.target.value
}

function handleTab (e) {
  e.preventDefault()

  const target = document.getElementById('gp-editor-target')
  const currentValue = content.value
  const startIndex = target.selectionStart
  const endIndex = target.selectionEnd

  target.value = content.value = currentValue.substring(0, startIndex) + '\t' + currentValue.substring(endIndex)
  target.selectionEnd = endIndex + 1
}

function handleTextareaScroll () {
  const textarea = document.getElementById('gp-editor-target')

  scrollIndex.value = textarea.scrollTop * -1
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

.gp-editor {
  display: flex;
  overflow-y: hidden;
  height: 480px;
  border: 1px solid #eee;
  font-family: 'Roboto Mono', monospace;
  border-radius: 0.5rem;

  .gp-editor-lines {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    border-right: 1px solid #eee;
    background: #fdfdfd;
    text-align: right;
    color: #444;

    span {
      padding: 0 1rem;
    }
  }

  textarea {
    width: 100%;
    height: 100%;
    outline: 0;
    resize: none;
    padding: 0 0 0 2px;
    font-size: 13px;
    border: 0;
    font-family: inherit;
    color: #111;

    &:disabled {
      background: #fff;
    }
  }
}
</style>
