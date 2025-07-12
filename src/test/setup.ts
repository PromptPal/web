import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset any request handlers that are declared during tests
afterEach(() => {
  server.resetHandlers()
})

// Clean up after all tests
afterAll(() => {
  server.close()
})

// Mock MetaMask SDK
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  },
  writable: true,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
