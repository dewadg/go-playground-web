<template>
  <div class="gp-auth-success">
    <div>
      <GpLogo text-align="center" />
      Authentication success. Redirecting...
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/auth'
import GpLogo from '../components/GpLogo.vue'

const router = useRouter()

onMounted(() => {
  const queries = Object.fromEntries(new URLSearchParams(window.location.search).entries())
  if (!queries.access_token) {
    return window.alert('Missing access token')
  }

  const { setToken } = useAuth()
  setToken(queries.access_token)

  router.push({ name: 'home' })
})
</script>

<style lang="scss">
.gp-auth-success {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
