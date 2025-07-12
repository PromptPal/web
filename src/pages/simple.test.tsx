import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'

// Simple component for testing
function SimpleComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>This is a test</p>
    </div>
  )
}

describe('Simple Test', () => {
  it('renders basic component', () => {
    render(<SimpleComponent />)
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
    expect(screen.getByText('This is a test')).toBeInTheDocument()
  })

  it('has proper heading structure', () => {
    render(<SimpleComponent />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Component')
  })
})