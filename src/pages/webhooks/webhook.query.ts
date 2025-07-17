import { graphql } from '@/gql'

// List all webhooks for a project
export const webhooksList = graphql(`
  query allWebhooksList($projectId: Int!, $pagination: PaginationInput!) {
    webhooks(projectId: $projectId, pagination: $pagination) {
      count
      edges {
        id
        name
        url
        events
        enabled
        createdAt
        updatedAt
      }
    }
  }
`)

// Get single webhook for editing
export const getWebhook = graphql(`
  query getWebhookForEdit($id: Int!) {
    webhook(id: $id) {
      id
      name
      url
      events
      enabled
      secret
      createdAt
      updatedAt
      project {
        id
        name
      }
    }
  }
`)

// Get webhook calls history
export const getWebhookCalls = graphql(`
  query getWebhookCalls($webhookId: Int!, $pagination: PaginationInput!) {
    webhookCalls(webhookId: $webhookId, pagination: $pagination) {
      count
      edges {
        id
        status
        payload
        response
        createdAt
      }
    }
  }
`)

// Create webhook mutation
export const createWebhook = graphql(`
  mutation createWebhook($projectId: Int!, $data: WebhookPayload!) {
    createWebhook(projectId: $projectId, data: $data) {
      id
      name
      url
      events
      enabled
    }
  }
`)

// Update webhook mutation
export const updateWebhook = graphql(`
  mutation updateWebhook($id: Int!, $data: WebhookUpdatePayload!) {
    updateWebhook(id: $id, data: $data) {
      id
      name
      url
      events
      enabled
    }
  }
`)

// Delete webhook mutation
export const deleteWebhook = graphql(`
  mutation deleteWebhook($id: Int!) {
    deleteWebhook(id: $id)
  }
`)
