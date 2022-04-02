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
import { computed, onMounted, ref, watch } from 'vue'
import { useStack } from '../composables/stack'

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

// textarea instance
let textarea = undefined

const scrollIndex = ref(0)

const {
  state: undoHistory,
  pop: undoPop,
  push: undoPush
} = useStack()

const {
  state: redoHistory,
  pop: redoPop,
  push: redoPush
} = useStack()

const content = computed({
  get: _ => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const lines = computed(() => content.value.split('\n').length)

watch(props, _ => {
  updateTextareaValue(props.modelValue, 1)
  content.value = props.modelValue
})

onMounted(() => {
  textarea = document.getElementById('gp-editor-target')

  updateTextareaValue(content.value, 43)
  textarea.focus()

  document.onkeydown = (e) => {
    // handle redo
    if (e.metaKey && e.shiftKey && e.key === 'z') {
      e.preventDefault()

      return redoChange()
    }

    // handle undo
    if (e.metaKey && e.key === 'z') {
      e.preventDefault()

      return undoChange()
    }
  }
})

function updateTextareaValue (value, index) {
  textarea.value = value
  textarea.selectionEnd = index
}

function undoChange () {
  const previous = undoPop()
  if (!previous) return

  redoPush({
    value: content.value,
    index: textarea.selectionEnd
  })
  updateTextareaValue(previous.value, previous.index)
  content.value = previous.value
}

function redoChange () {
  const previous = redoPop()
  if (!previous) return

  undoPush({
    value: content.value,
    index: textarea.selectionEnd
  })
  updateTextareaValue(previous.value, previous.index)
  content.value = previous.value
}

function handleContentChange (e) {
  e.preventDefault()

  undoPush({
    value: content.value,
    index: textarea.selectionEnd - 1
  })

  content.value = e.target.value
}

function handleTab (e) {
  e.preventDefault()

  undoPush({
    value: textarea.value,
    index: textarea.selectionEnd
  })

  const currentValue = content.value
  const startIndex = textarea.selectionStart
  const endIndex = textarea.selectionEnd
  const newValue = currentValue.substring(0, startIndex) + '\t' + currentValue.substring(endIndex)

  updateTextareaValue(
    newValue,
    endIndex + 1
  )

  content.value = newValue
}

function handleTextareaScroll () {
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
