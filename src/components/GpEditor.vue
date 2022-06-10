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
        v-for="line in lines"
        :key="line.line"
        :class="{
          'error': line.errorMessage
        }"
        :title="line.errorMessage"
      >
        {{ line.line }}
      </span>
    </div>
    <textarea
      id="gp-editor-target"
      @input="handleContentChange"
      @keydown.tab="handleTab"
      @scroll="handleTextareaScroll"
      @click="handleTextareaClick"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRedoable } from '../composables/redoable'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  errorLines: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// textarea instance
let textarea = undefined

const scrollIndex = ref(0)

const {
  value: model,
  setValue: setModel,
  undo: undoModel,
  redo: redoModel
} = useRedoable({
  value: '',
  index: 0
})

const errorLineMap = computed(() =>
  props.errorLines.reduce((carry, item) => carry.set(item.line, item), new Map())
)

const lines = computed(() => {
  const output = []

  for (let i = 0; i < model.value.value.split('\n').length; i++) {
    output.push({
      line: i + 1,
      errorMessage: errorLineMap.value.has(i + 1)
        ? errorLineMap.value.get(i + 1).message
        : ''
    })
  }

  return output
})

watch(props, (newVal, oldVal) => {
  if (newVal.modelValue !== oldVal.modelValue) {
    return
  }

  updateTextareaValue(newVal.modelValue, model.value.index)
  setModel({
    value: newVal.modelValue,
    index: model.value.index
  }, false)
})

onMounted(() => {
  textarea = document.getElementById('gp-editor-target')
  textarea.focus()

  document.addEventListener('keydown', (e) => {
    // update caret position when moved by arrow keys
    if (e.code.startsWith('Arrow')) {
      setModel({
        value: model.value.value,
        index: textarea.selectionStart
      })
    }

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
  })
})

function updateTextareaValue (value, index) {
  textarea.value = value
  textarea.selectionEnd = index
}

function undoChange () {
  if (!undoModel()) {
    return
  }

  updateTextareaValue(model.value.value, model.value.index)
  emitUpdate(model.value.value)
}

function redoChange () {
  if (!redoModel()) {
    return
  }

  updateTextareaValue(model.value.value, model.value.index)
  emitUpdate(model.value.value)
}

function emitUpdate (value) {
  emit('update:modelValue', value)
}

function handleContentChange (e) {
  e.preventDefault()

  setModel({
    value: e.target.value,
    index: e.target.selectionEnd
  })
  emitUpdate(model.value.value)
}

function handleTab (e) {
  e.preventDefault()

  const currentValue = model.value.value
  const currentValueInSelection = currentValue.substring(e.target.selectionStart, e.target.selectionEnd)
  const isSelection = e.target.selectionStart !== e.target.selectionEnd

  let newValue
  let textareaIndex

  if (!isSelection) {
    textareaIndex = e.target.selectionEnd
    newValue = currentValue.substring(0, e.target.selectionStart) + '\t' + currentValue.substring(textareaIndex)
  } else {
    const updatedSelection = currentValueInSelection
      .split('\n')
      .map(item => item.length > 0 ? `\t${item}` : item)
      .join('\n')

    newValue = currentValue.substring(0, e.target.selectionStart) + updatedSelection + currentValue.substring(e.target.selectionEnd)
    textareaIndex = e.target.selectionEnd + 2
    if (newValue[textareaIndex] === '\n') {
      textareaIndex--
    }
  }

  updateTextareaValue(
    newValue,
    textareaIndex + 1
  )
  setModel({
    value: newValue,
    index: textareaIndex + 1
  })
  emitUpdate(model.value.value)
}

function handleTextareaScroll () {
  scrollIndex.value = textarea.scrollTop * -1
}

function handleTextareaClick (e) {
  e.preventDefault()

  setModel({
    value: model.value.value,
    index: e.target.selectionEnd
  })
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
      display: block;
      padding: 0 1rem;
      cursor: pointer;
      box-sizing: border-box;
      border-right: 5px solid transparent;

      &.error {
        border-right: 5px solid #e74c3c;
      }
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
