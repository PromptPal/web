import { graphql } from '@/gql'

export const q = graphql(`
  query allProjectListLite($pagination: PaginationInput!) {
    projects(pagination: $pagination) {
      count
      edges {
        id
        name
      }
    }
  }
`)

export const qd = graphql(`
  query getPromptForEdit($id: Int!) {
    prompt(id: $id) {
      id
      name
      description
      enabled
      debug
      tokenCount
      prompts {
        prompt
        role
      }
      variables {
        name
        type
      }
      publicLevel
      createdAt
      updatedAt

      provider {
        id
        name
      }
    }
  }
`)

export const cm = graphql(`
  mutation createPrompt($data: PromptPayload!) {
    createPrompt(data: $data) {
      id
    }
  }
`)

export const um = graphql(`
  mutation updatePrompt($id: Int!, $data: PromptPayload!) {
    updatePrompt(id: $id, data: $data) {
      id
    }
  }
`)
