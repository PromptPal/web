import { API_PREFIX } from "../constants"
import { HttpRequest } from "./http"
import { ListResponse } from "./types"

export type Project = {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  enabled: boolean;
  openAIBaseURL: string;
  openAIModel: string;
  openAITemperature: number;
  openAITopP: number;
  openAIMaxTokens: number;
  edges: any;
}

export function getProjectList(cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<Project>>(`${API_PREFIX}/admin/projects?cursor=${cursor}&limit=20`, {
    signal,
  });
}

export function getProjectDetail(pid: number, signal?: AbortSignal) {
  return HttpRequest<Project>(`${API_PREFIX}/admin/projects/${pid}`, {
    signal,
  });
}

export type createProjectPayload = {
  name: string
  openaiToken: string
}

export function createProject(payload: createProjectPayload) {
  return HttpRequest<Project, createProjectPayload>(
    `${API_PREFIX}/admin/projects`, {
    method: 'POST',
    body: payload
  })
}


// Enabled           *bool    `json:"enabled"`
// OpenAIBaseURL     *string  `json:"openAIBaseURL"`
// OpenAIModel       *string  `json:"openAIModel"`
// OpenAIToken       *string  `json:"openAIToken"`
// OpenAITemperature *float64 `json:"openAITemperature"`
// OpenAITopP        *float64 `json:"openAITopP"`
// OpenAIMaxTokens   *int     `json:"openAIMaxTokens"`

export type updateProjectPayload = {
  enabled?: boolean
  openAIBaseURL?: string
  openAIModel?: string
  openAIToken?: string
  openAITemperature?: number
  openAITopP?: number
  openAIMaxTokens?: number
}

export function updateProject(pid: number, payload: updateProjectPayload) {
  return HttpRequest<Project, updateProjectPayload>(
    `${API_PREFIX}/admin/projects/${pid}`, {
    method: 'PUT',
    body: payload
  })
}