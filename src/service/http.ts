import { toast } from 'react-hot-toast'
import { HTTP_ENDPOINT } from '../constants'

function getToken() {
  const tk = localStorage.getItem('pp:token')
  if (!tk) return null
  try {
    return JSON.parse(tk)
  } catch {
    return null
  }
}

type HttpRequestInit<T = undefined> = Omit<RequestInit, 'body'> & { body?: T }

export type HttpErrorResponse = {
  code: number
  error: string
}

export function HttpRequest<T, I = undefined>(
  input: string,
  init: HttpRequestInit<I> = {} as HttpRequestInit<I>,
  options?: {
    ignoreErrors?: boolean
  }
): Promise<Response> {
  const req = input.startsWith('http') ?
    input :
    `${HTTP_ENDPOINT}${input}`

  const token = getToken()

  const data = {
    ...init,
  }

  if (!data.signal) {
    data.signal = AbortSignal.timeout(10_000)
  }

  data.headers = {
    ...data.headers,
    // 'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${getToken()}` : ''
  }
  if (data.body) {
    (data as any).body = data.body
  }

  return fetch(req, data as any)
    .then(res => {
      if (res.ok) {
        return res
      } else {
        throw res
      }
    }).catch(async (err: Response | Error) => {
      if (err instanceof Response) {
        if (err.status === 401) {
          // clear token
          localStorage.removeItem('pp:token')
          window.location.reload()
        }
      }

      // let errorContent: HttpErrorResponse | Error
      let errorContent: any
      if ((err instanceof Response) && !err.bodyUsed) {
        errorContent = await err.json() as HttpErrorResponse
      } else {
        errorContent = err as any
      }

      const isAbortError = (err as any).name === 'AbortError'

      if (!options?.ignoreErrors && !isAbortError) {
        toast.error(errorContent.message ?? errorContent.error ?? errorContent.toString())
      }

      throw errorContent
    })
}