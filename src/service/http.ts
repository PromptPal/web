import { toast } from 'react-hot-toast'
import { HTTP_ENDPOINT } from '../constants'

function getToken() {
  const tk = localStorage.getItem('pp:token')
  if (!tk) return null
  try {
    return JSON.parse(tk)
  }
  catch {
    return null
  }
}

type HttpRequestInit<T = undefined> = Omit<RequestInit, 'body'> & { body?: T }

export type HttpErrorResponse = {
  code: number
  error: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HttpRequest<T, I = undefined>(
  input: RequestInfo | URL,
  init: HttpRequestInit<I> = {} as HttpRequestInit<I>,
  options?: {
    ignoreErrors?: boolean
  },
): Promise<Response> {
  const req = (typeof input === 'string' ? input : input.toString()).startsWith(
    'http',
  )
    ? input
    : `${HTTP_ENDPOINT}${input}`

  const token = getToken()

  const data = {
    ...init,
  }

  if (!data.signal) {
    // 10 mins
    data.signal = AbortSignal.timeout(1000 * 60 * 10)
  }

  data.headers = {
    ...data.headers,
    // 'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${getToken()}` : '',
  }
  if (data.body && typeof data.body !== 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(data as any).body = JSON.stringify(data.body)
  }

  return fetch(req, data as never)
    .then((res) => {
      if (res.ok) {
        return res
      }
      else {
        throw res
      }
    })
    .catch(async (err: Response | Error) => {
      if (err instanceof Response) {
        if (err.status === 401) {
          // clear token
          if (localStorage.getItem('pp:token')) {
            localStorage.removeItem('pp:token')
          }
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth'
          }
        }
      }

      // let errorContent: HttpErrorResponse | Error
      let errorContent: HttpErrorResponse & { message?: string, name?: string }
      if (err instanceof Response && !err.bodyUsed) {
        errorContent = (await err.json()) as HttpErrorResponse
      }
      else {
        errorContent = err as unknown as HttpErrorResponse
      }
      const isAbortError
        = err instanceof Error ? err.name === 'AbortError' : false

      if (!options?.ignoreErrors && !isAbortError) {
        toast.error(
          errorContent.message ?? errorContent.error ?? errorContent.toString(),
        )
      }

      throw errorContent
    })
}
