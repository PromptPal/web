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

export function createOpenToken(pid: number, ttl: number) {
  return HttpRequest<OpenToken, { ttl: number }>(
    `${API_PREFIX}/admin/projects/${pid}/open-tokens`, {
    method: 'POST',
    body: { ttl },
  });
}

export function deleteOpenToken(id: number) {
  return HttpRequest<OpenToken, { id: number }>(
    `${API_PREFIX}/admin/open-tokens/${id}`, {
    method: 'DELETE',
  });
}