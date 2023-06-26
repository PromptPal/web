import { API_PREFIX } from "../constants";
import { HttpRequest } from "./http";
import { User } from "./login";

export function getUserProfile(id: number, signal?: AbortSignal) {
  return HttpRequest<User>(`${API_PREFIX}/admin/users/${id}`, {
    signal,
  });
}