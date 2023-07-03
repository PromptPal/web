import { API_PREFIX } from "../constants";
import { HttpRequest } from "./http";
import { ListResponse } from "./types";

export type OpenToken = {
  id: number
  name: string
  description: string
}

export function listOpenTokens(pid: number, cursor: number, signal?: AbortSignal) {
  return HttpRequest<ListResponse<OpenToken>>(`${API_PREFIX}/admin/projects/${pid}/open-tokens?cursor=${cursor}&limit=20`, {
    signal,
  });
}

export type createOpenTokenPayload = {
  name: string
  description: string
  ttl: number
}

export function createOpenToken(pid: number, payload: createOpenTokenPayload) {
  return HttpRequest<{ token: string }, createOpenTokenPayload>(
    `${API_PREFIX}/admin/projects/${pid}/open-tokens`, {
    method: 'POST',
    body: payload,
  });
}

export function deleteOpenToken(id: number) {
  return HttpRequest<OpenToken, { id: number }>(
    `${API_PREFIX}/admin/open-tokens/${id}`, {
    method: 'DELETE',
  });
}