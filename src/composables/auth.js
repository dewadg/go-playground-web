import { ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export function useAuth () {
  const token = ref('')

  const setToken = (t) => {
    token.value = t

    window.localStorage.setItem('go_playground_access_token', t)
  }

  const getToken = () => {
    const t = window.localStorage.getItem('go_playground_access_token')

    token.value = t || ''
  }

  getToken()

  return {
    token,
    setToken,
    getToken
  }
}

export function useWhoami () {
  const { result, loading, error } = useQuery(gql`
    query {
      whoami {
        id
        email
        createdAt
        updatedAt
      }
    }
  `)

  return {
    result,
    loading,
    error
  }
}
