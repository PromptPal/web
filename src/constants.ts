// set endpoint to '' if in production. the static files will be served from the server directly
export const HTTP_ENDPOINT = import.meta.env.PROD ? '' : 'http://localhost:7788'
export const API_PREFIX = '/api/v1'