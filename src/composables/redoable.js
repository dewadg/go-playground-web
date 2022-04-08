import { computed, reactive } from 'vue'

export function useRedoable (initial) {
  const undoHist = []
  const redoHist = []
  const state = reactive({ value: initial })

  const currentValue = computed(() => state.value)

  function setValue (value) {
    undoHist.unshift(state.value)
    state.value = value
  }

  function undo () {
    if (undoHist.length === 0) {
      return false
    }

    redoHist.unshift(state.value)
    state.value = undoHist.shift()

    return true
  }

  function redo () {
    if (redoHist.length === 0) {
      return false
    }

    undoHist.unshift(state.value)
    state.value = redoHist.shift()

    return true
  }

  return {
    value: currentValue,
    setValue,
    undo,
    redo
  }
}
