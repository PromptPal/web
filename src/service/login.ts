import { API_PREFIX } from '../constants'
import { HttpRequest } from './http'

type doLoginPayload = {
  address: string,
  signature: string,
  message: string
}

export type doLoginResponse = {
  user: User;
  token: string;
}
export type User = {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  addr: string;
  email: string;
  lang: string;
  level: number;
  edges: any;
}

export function doLogin(payload: doLoginPayload) {
  return HttpRequest<doLoginResponse, doLoginPayload>(
    `${API_PREFIX}/auth/login`, {
      method: 'POST',
      body: payload
    })
}