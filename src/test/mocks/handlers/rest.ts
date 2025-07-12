import { http, HttpResponse } from 'msw'

export const restHandlers = [
  // Auth endpoints
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      },
    })
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // User profile
  http.get('/api/v1/user/profile', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01T00:00:00Z',
    })
  }),

  // Health check
  http.get('/api/v1/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  // File uploads (if any)
  http.post('/api/v1/upload', () => {
    return HttpResponse.json({
      url: 'https://example.com/uploaded-file.jpg',
      filename: 'test-file.jpg',
    })
  }),

  // Catch-all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`)
    return HttpResponse.json(
      { error: 'Not found' },
      { status: 404 },
    )
  }),
]
