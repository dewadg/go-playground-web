import { test, assert } from 'vitest'
import { useRedoable } from './redoable'

test.concurrent('useRedoable', () => {
  const { value, setValue, undo, redo } = useRedoable({ text: '' })

  setValue({ text: 'First' })
  assert.equal(value.value.text, 'First')

  setValue({ text: 'Second' })
  assert.equal(value.value.text, 'Second')

  undo()
  assert.equal(value.value.text, 'First')

  undo()
  assert.equal(value.value.text, '')

  redo()
  assert.equal(value.value.text, 'First')

  redo()
  assert.equal(value.value.text, 'Second')

  redo()
  assert.equal(value.value.text, 'Second')

  undo()
  assert.equal(value.value.text, 'First')
}, 1000)
