import { graphql } from '@/gql'

// List all webhooks for a project
export const webhooksList = graphql(`
  query allWebhooksList($projectId: Int!, $pagination: PaginationInput!) {
    webhooks(projectId: $projectId, pagination: $pagination) {
      count
      edges {
        id
        name
        description
        url
        event
        enabled
        createdAt
        updatedAt
        creator {
          id
          name
        }
        project {
          id
          name
        }
      }
    }
  }
`)

// Get single webhook - Note: This query is not available in the schema, webhook details should be fetched from the list
// If you need individual webhook details, you can filter from the webhooks list query

// Create webhook mutation
export const createWebhook = graphql(`
  mutation createWebhook($data: WebhookPayload!) {
    createWebhook(data: $data) {
      id
      name
      description
      url
      event
      enabled
      createdAt
      updatedAt
    }
  }
`)

// Update webhook mutation
export const updateWebhook = graphql(`
  mutation updateWebhook($id: Int!, $data: WebhookUpdatePayload!) {
    updateWebhook(id: $id, data: $data) {
      id
      name
      description
      url
      event
      enabled
      createdAt
      updatedAt
    }
  }
`)

// Delete webhook mutation
export const deleteWebhook = graphql(`
  mutation deleteWebhook($id: Int!) {
    deleteWebhook(id: $id)
  }
`)

// Note: Webhook calls functionality is not yet available in the current schema
// The webhook_call.gql extensions need to be properly integrated in the backend first
