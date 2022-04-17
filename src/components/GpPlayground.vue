<template>
  <section class="gp-playground">
    <div class="gp-playground-header">
      <router-link :to="{ name: 'home' }">
        <h1 class="gp-playground-title">Go Playground</h1>
      </router-link>
      <div class="gp-playground-controls">
        <GpButton
          v-if="shareLink.length === 0"
          :disabled="loading"
          @click="handleShare"
          style="margin-right: 0.5rem;"
        >
          Share
        </GpButton>
        <GpShareable
          v-else
          :link="shareLink"
          style="margin-right: 0.5rem;"
        />
        <GpButton
          v-if="isSharedLink"
          :disabled="loading"
          @click="handleUpdateCode"
          style="margin-right: 0.5rem;"
        >
          Update Code
        </GpButton>
        <GpButton
          :disabled="loading"
          @click="handleRun"
        >
          Run
        </GpButton>
      </div>
    </div>
    <GpEditor
      v-model="code"
      :disabled="loading"
      :error-lines="executionErrorLines"
    />
    <GpErrorAlert :error="error" />
    <GpTerminal :result="executionResult" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useMutation, useLazyQuery } from '@vue/apollo-composable'
import GpEditor from './GpEditor.vue'
import GpTerminal from './GpTerminal.vue'
import GpButton from './GpButton.vue'
import GpShareable from './GpShareable.vue'
import GpErrorAlert from './GpErrorAlert.vue'

const router = useRouter()
const route = useRoute()

const code = ref('')

const executionOutput = reactive([])
const executionErrorLines = reactive([])

const shareId = ref('')
const isSharedLink = ref(false)

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
      errorLines {
        line
        column
        message
      }
    }
  }
`)

const {
  loading: shareLoading,
  error: shareError,
  mutate: shareMutate,
  onDone: shareDone
} = useMutation(gql`
  mutation($input: [String!]!) {
    createItem(payload: {
      input: $input
    }) {
      shareId
    }
  }
`)

const {
  result: itemResult,
  loading: itemLoading,
  error: itemError,
  load: itemFetch
} = useLazyQuery(gql`
  query($id: ID!) {
    item(id: $id) {
      input
    }
  }
`, () => ({
  id: route.params.shareId
}))

const {
  loading: updateLoading,
  error: updateError,
  mutate: updateMutate
} = useMutation(gql`
  mutation($shareId: ID!, $input: [String!]!) {
    updateItem(
      shareId: $shareId,
      payload: {
        input: $input
      }
    ) {
      id
      input
    }
  }
`)

runDone((result) => {
  executionOutput.length = 0
  executionOutput.push(...result.data.execute.output)

  executionErrorLines.length = 0
  executionErrorLines.push(...(result.data.execute.errorLines || []))
})

shareDone((result) => {
  shareId.value = result.data.createItem.shareId
  isSharedLink.value = true

  router.replace({
    name: 'home',
    params: {
      shareId: result.data.createItem.shareId
    }
  })
})

const loading = computed(_ => runLoading.value || shareLoading.value || itemLoading.value || updateLoading.value)
const error = computed(_ => runError.value || shareError.value || itemError.value || updateError.value)

const executionResult = computed(_ => {
  if (runLoading.value) {
    return {
      error: null,
      loading: true,
      output: [],
      errorLines: []
    }
  }

  const error = runError.value || null

  return {
    error,
    loading: false,
    output: executionOutput
  }
})

const shareLink = computed(_ => shareId.value.length === 0
  ? ''
  : `${window.location.origin}/${shareId.value}`
)

watch(itemResult, (result) => {
  if (itemLoading.value) return

  code.value = result.item.input.join('\n')
})

watch(code, () => {
  if (executionErrorLines.length > 0) {
    executionErrorLines.length = 0
  }
})

onMounted(_ => {
  if (route.params.shareId) {
    itemFetch()

    shareId.value = route.params.shareId
    isSharedLink.value = true
  } else {
    code.value = `package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
`
  }
})

function handleRun () {
  runMutate({
    input: code.value.split('\n')
  })
}

function handleShare () {
  shareMutate({
    input: code.value.split('\n')
  })
}

function handleUpdateCode () {
  updateMutate({
    shareId: shareId.value,
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

    a {
      color: inherit;
      text-decoration: none;
    }

    .gp-playground-title {
      margin: 0 0 1rem 0;
      padding: 0.5rem 0 0 0;
      font-weight: normal;
      font-size: 2rem;
    }

    .gp-playground-controls {
      display: flex;
    }
  }

  .gp-editor {
    margin-bottom: 1rem;
  }
}
</style>
