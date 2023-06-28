import { API_PREFIX } from "../constants"
import { HttpRequest } from "./http"
import { ListResponse } from "./types"

export function getProjectList(cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<any>>(`${API_PREFIX}/admin/projects?cursor=${cursor}`, {
    signal,
  });
}

export type createProjectPayload = {
  name: string
  openaiToken: string
}

export function createProject(payload: createProjectPayload) {
  return HttpRequest<any, createProjectPayload>(
    `${API_PREFIX}/admin/projects`, {
    method: 'POST',
    body: payload
  })
}