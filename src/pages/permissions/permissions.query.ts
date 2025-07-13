import { graphql } from '../../gql'

// For now, we'll create a mock permissions system using the existing user system
// until the RBAC schema is integrated into the main GraphQL schema

export const CREATE_USER = graphql(`
  mutation CreateUser($data: CreateUserPayload!) {
    createUser(data: $data) {
      user {
        id
        name
        email
        avatar
      }
      password
    }
  }
`)

export const GET_PROJECT = graphql(`
  query GetProject($id: Int!) {
    project(id: $id) {
      id
      name
    }
  }
`)

// Mock data interfaces for now - these will be replaced when RBAC schema is integrated
export interface MockUserRole {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar: string
  }
  role: {
    id: string
    name: string
    description: string
    isSystemRole: boolean
  }
  createdAt: string
}

export interface MockRole {
  id: string
  name: string
  description: string
  isSystemRole: boolean
  permissions: Array<{
    id: string
    name: string
    action: string
    resource: string
  }>
}
