import { setupServer } from 'msw/node'
import { graphqlHandlers } from './handlers/graphql'
import { restHandlers } from './handlers/rest'

// This configures a request mocking server with the given request handlers
export const server = setupServer(...graphqlHandlers, ...restHandlers)
