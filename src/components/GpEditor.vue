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
import { useRedoable } from '../composables/redoable'

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

const isInit = ref(false)
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

const lines = computed(() => model.value.value.split('\n').length)

watch(model, _ => {
  emit('update:modelValue', model.value.value)
})

watch(props, (value) => {
  if (isInit.value) {
    return
  }

  updateTextareaValue(value.modelValue, 0)
  setModel({
    value: value.modelValue,
    index: 0
  })
  isInit.value = true
})

onMounted(() => {
  textarea = document.getElementById('gp-editor-target')
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
  if (!undoModel()) {
    return
  }

  updateTextareaValue(model.value.value, model.value.index)
}

function redoChange () {
  if (!redoModel()) {
    return
  }

  updateTextareaValue(model.value.value, model.value.index)
}

function handleContentChange (e) {
  e.preventDefault()

  setModel({
    value: e.target.value,
    index: textarea.selectionEnd
  })
}

function handleTab (e) {
  e.preventDefault()

  const currentValue = model.value.value
  const startIndex = textarea.selectionStart
  const endIndex = textarea.selectionEnd
  const newValue = currentValue.substring(0, startIndex) + '\t' + currentValue.substring(endIndex)

  updateTextareaValue(
    newValue,
    endIndex + 1
  )
  setModel({
    value: newValue,
    index: endIndex + 1
  })
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
