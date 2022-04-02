import { reactive } from 'vue'

export function useStack () {
  const state = reactive({
    stack: []
  })

  function push (item) {
    state.stack = [
      item,
      ...state.stack
    ]
  }

  function pop () {
    return state.stack.shift()
  }

  function peek () {
    return state.stack[0] || undefined
  }

  return {
    state,
    push,
    pop,
    peek
  }
}
