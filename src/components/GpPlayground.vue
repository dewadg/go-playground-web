<template>
  <section class="gp-playground">
    <div class="gp-playground-header">
      <h2 class="gp-playground-title">Go Playground</h2>
      <div class="gp-playground-controls">
        <GpButton
          :disabled="runLoading"
          @click="handleRun"
        >
          Run
        </GpButton>
      </div>
    </div>
    <GpEditor
      v-model="code"
      :disabled="runLoading"
    />
    <GpTerminal :result="executionResult" />
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import GpEditor from './GpEditor.vue'
import GpTerminal from './GpTerminal.vue'
import GpButton from './GpButton.vue'

const code = ref(`package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
`)

const executionOutput = reactive([])

const {
  loading: runLoading,
  error: runError,
  mutate: runMutate,
  onDone: runDone
} = useMutation(gql`
  mutation($input: [String!]!) {
    execute(payload: {
      input: $input
    }) {
      output
    }
  }
`)

runDone((result) => {
  executionOutput.length = 0
  executionOutput.push(...result.data.execute.output)
})

const executionResult = computed(_ => {
  if (runLoading.value) {
    return {
      error: null,
      loading: true,
      output: []
    }
  }

  const error = runError.value || null

  return {
    error,
    loading: false,
    output: executionOutput
  }
})

function handleRun () {
  runMutate({
    input: code.value.split('\n')
  })
}
</script>

<style lang="scss">
.gp-playground {
  max-width: 960px;
  margin: 0 auto;

  .gp-playground-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .gp-playground-title {
      margin: 0 0 1rem 0;
      padding: 0.5rem 0 0 0;
      font-weight: normal;
      font-size: 2rem;
    }

    .gp-playground-controls {

    }
  }

  .gp-editor {
    margin-bottom: 1rem;
  }
}
</style>
