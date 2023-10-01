import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { toast } from 'react-hot-toast'
import { HTTP_ENDPOINT } from '../constants'
import { HttpRequest } from './http'

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      toast.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const httpLink = new HttpLink({
  uri: `${HTTP_ENDPOINT}/api/v2/graphql`,
  credentials: 'include',
  fetch: HttpRequest
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // let token = localStorage.getItem('pp:token')
  // if (token) {
  //   token = token.replace(/"/g, '')
  // }
  // // add the authorization to the headers
  // operation.setContext(({ headers = {} }) => ({
  //   headers: {
  //     ...headers,
  //     Authorization: `Bearer ${token}`
  //   }
  // }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authMiddleware, httpLink])
})
