import { toast } from "react-hot-toast"
import { HTTP_ENDPOINT } from "../constants"

function getToken() {
  const tk = localStorage.getItem("pp:token")
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
): Promise<T> {
  const req = input.startsWith('https') ?
    input :
    `${HTTP_ENDPOINT}${input}`

  const token = getToken()

  const data = {
    ...init,
  }

  data.headers = {
    ...data.headers,
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${getToken()}` : ''
  }
  if (data.body) {
    (data as any).body = JSON.stringify(data.body)
  }

  return fetch(req, data as any)
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw res
      }
    }).catch(async (err: Response | Error) => {
      // let errorContent: HttpErrorResponse | Error
      let errorContent: any
      if ((err instanceof Response) && !err.bodyUsed) {
        errorContent = await err.json() as HttpErrorResponse
      } else {
        errorContent = err as any
      }

      if (!options?.ignoreErrors) {
        toast.error(errorContent.message ?? errorContent.error ?? errorContent.toString())
      }

      throw errorContent
    })
}