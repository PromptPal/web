import { API_PREFIX } from "../constants"
import { HttpRequest } from "./http"
import { ListResponse } from "./types"

export type Project = {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  enabled: boolean;
  OpenAIBaseURL: string;
  openAIModel: string;
  openAITemperature: number;
  openAITopP: number;
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