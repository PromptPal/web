import { graphql } from '@/gql'

export const q = graphql(`
  query fetchPromptDetail($id: Int!) {
    prompt(id: $id) {
      id
      hashId
      name
      description
      enabled
      debug
      tokenCount
      publicLevel
      createdAt
      updatedAt
      project {
        id
        name
      }
      provider {
        id
        name
        description
        enabled
        source
        endpoint
        organizationId
        defaultModel
        temperature
        topP
        maxTokens
        config
        createdAt
        updatedAt
        headers
      }
      creator {
        id
        name
      }
      prompts {
        prompt
        role
      }
      variables {
        name
        type
      }
    }
  }
`)
