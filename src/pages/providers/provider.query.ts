import { graphql } from '@/gql'

export const pl = graphql(`
  query allProviderListLite($pagination: PaginationInput!) {
    providers(pagination: $pagination) {
      count
      edges {
        id
        name
      }
    }
  }
`)

export const p = graphql(`
  query getProviderForEdit($id: Int!) {
    provider(id: $id) {
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

      projects {
        count
        edges {
          id
          name
        }
      }
      prompts {
        count
        edges {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`)

export const cp = graphql(`
  mutation createProvider($data: ProviderPayload!) {
    createProvider(data: $data) {
      id
    }
  }
`)

export const up = graphql(`
  mutation updateProvider($id: Int!, $data: ProviderUpdatePayload!) {
    updateProvider(id: $id, data: $data) {
      id
    }
  }
`)

export const dp = graphql(`
  mutation deleteProvider($id: Int!) {
    deleteProvider(id: $id)
  }
`)
