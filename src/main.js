import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { router } from './router'
import App from './App.vue'
import apolloClient from './plugins/apollo'

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: _ => h(App)
})

app.use(router)

router.isReady().then(_ => app.mount('#app'))
