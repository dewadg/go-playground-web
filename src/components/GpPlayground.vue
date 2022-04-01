<template>
  <section class="gp-playground">
    <div class="gp-playground-header">
      <h2 class="gp-playground-title">Go Playground</h2>
      <div class="gp-playground-controls">
        <GpButton @click="handleRun">Run</GpButton>
      </div>
    </div>
    <GpEditor v-model="code" />
    <GpTerminal />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import GpEditor from './GpEditor.vue'
import GpTerminal from './GpTerminal.vue'
import GpButton from './GpButton.vue'

const code = ref(`package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
`)

function handleRun () {
  console.log('Test')
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
