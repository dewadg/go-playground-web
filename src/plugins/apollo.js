import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_HOST}/graphql`
})

const authLink = new ApolloLink((operation, forward) => {
  const t = window.localStorage.getItem('go_playground_access_token') || ''
  if (!t) {
    return forward(operation)
  }

  operation.setContext({
    headers: {
      Authorization: `Bearer ${t}`
    }
  })

  return forward(operation)
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

export default apolloClient
