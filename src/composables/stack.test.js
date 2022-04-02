import { test, assert } from 'vitest'
import { useStack } from './stack'

test.concurrent('useStack', () => {
  const { state, pop, push, peek } = useStack()

  push('First item')
  assert.equal(state.stack.length, 1)

  const got = pop()
  assert.equal(got, 'First item')
  assert.equal(state.stack.length, 0)

  push('Item 1')
  push('Item 2')
  push('Item 3')

  assert.equal(peek(), 'Item 3')
  assert.equal(pop(), 'Item 3')
  assert.equal(pop(), 'Item 2')
  assert.equal(pop(), 'Item 1')
}, 1000)
