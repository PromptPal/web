import { graphql } from '@/gql'

export const getWebhook = graphql(`
  query getWebhook($id: Int!) {
    webhook(id: $id) {
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
`)

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

// Note: Webhook calls functionality is defined in ../PromptPal/schema/types/webhook_call.gql
// but has not been integrated into the backend GraphQL server yet.
// Once the backend exposes the webhookCalls query, uncomment the following:

export const webhookCalls = graphql(`
  query webhookCalls($input: WebhookCallsInput!) {
    webhookCalls(input: $input) {
      count
      edges {
        id
        webhookId
        traceId
        url
        requestHeaders
        requestBody
        statusCode
        responseHeaders
        responseBody
        startTime
        endTime
        isTimeout
        errorMessage
        userAgent
        ip
        createdAt
        updatedAt
        webhook {
          id
          name
        }
      }
    }
  }
`)
