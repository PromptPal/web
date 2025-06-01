import { HttpRequest } from './http'

export function fetchSSOSettings({ signal }: { signal: AbortSignal }): Promise<{
  enableSsoGoogle: boolean
}> {
  return HttpRequest(
    '/api/v1/sso/settings',
    {
      signal,
    },
  )
    .then(res => res.json())
}
