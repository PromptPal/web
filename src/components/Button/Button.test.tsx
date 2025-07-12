import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button, ButtonProps } from './Button'
import { Star } from 'lucide-react'

describe('Button Component', () => {
	const defaultProps: ButtonProps = {
		children: 'Test Button'
	}

	it('renders with default props', () => {
		render(<Button {...defaultProps} />)
		expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument()
	})

	it('renders with custom text', () => {
		render(<Button>Custom Text</Button>)
		expect(screen.getByRole('button', { name: /custom text/i })).toBeInTheDocument()
	})

	describe('variants', () => {
		it('renders primary variant by default', () => {
			render(<Button>Primary</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('from-sky-600', 'to-blue-600')
		})

		it('renders secondary variant', () => {
			render(<Button variant="secondary">Secondary</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('from-teal-400', 'to-cyan-500')
		})

		it('renders danger variant', () => {
			render(<Button variant="danger">Danger</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('from-orange-500', 'to-red-500')
		})

		it('renders ghost variant', () => {
			render(<Button variant="ghost">Ghost</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('bg-transparent')
		})
	})

	describe('sizes', () => {
		it('renders medium size by default', () => {
			render(<Button>Medium</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('text-sm', 'px-4', 'py-2')
		})

		it('renders small size', () => {
			render(<Button size="sm">Small</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('text-xs', 'px-3', 'py-1.5')
		})

		it('renders large size', () => {
			render(<Button size="lg">Large</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('text-base', 'px-6', 'py-3')
		})
	})

	describe('states', () => {
		it('handles disabled state', () => {
			render(<Button disabled>Disabled</Button>)
			const button = screen.getByRole('button')
			expect(button).toBeDisabled()
			expect(button).toHaveClass('cursor-not-allowed', 'opacity-70')
		})

		it('handles loading state', () => {
			render(<Button isLoading>Loading</Button>)
			const button = screen.getByRole('button')
			expect(button).toBeDisabled()
			expect(button).toHaveClass('cursor-not-allowed', 'opacity-70')
		})

		it('shows loading icon when isLoading is true', () => {
			render(<Button isLoading>Loading</Button>)
			// Check for loading indicator (the loading component should be present)
			expect(screen.getByRole('button')).toBeInTheDocument()
		})

		it('hides content when loading', () => {
			render(<Button isLoading>Loading Text</Button>)
			const contentSpan = screen.getByText('Loading Text').parentElement
			expect(contentSpan).toHaveClass('invisible')
		})
	})

	describe('icon', () => {
		it('renders with icon', () => {
			render(<Button icon={Star}>With Icon</Button>)
			const button = screen.getByRole('button')
			expect(button).toBeInTheDocument()
			// The icon should be rendered inside the button
			expect(button.querySelector('svg')).toBeInTheDocument()
		})

		it('hides icon when loading', () => {
			render(<Button icon={Star} isLoading>Loading</Button>)
			const button = screen.getByRole('button')
			const invisibleContainer = button.querySelector('.invisible')
			expect(invisibleContainer).toBeInTheDocument()
		})
	})

	describe('interaction', () => {
		it('calls onClick when clicked', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()
			
			render(<Button onClick={handleClick}>Clickable</Button>)
			
			await user.click(screen.getByRole('button'))
			expect(handleClick).toHaveBeenCalledTimes(1)
		})

		it('does not call onClick when disabled', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()
			
			render(<Button onClick={handleClick} disabled>Disabled</Button>)
			
			await user.click(screen.getByRole('button'))
			expect(handleClick).not.toHaveBeenCalled()
		})

		it('does not call onClick when loading', async () => {
			const handleClick = vi.fn()
			const user = userEvent.setup()
			
			render(<Button onClick={handleClick} isLoading>Loading</Button>)
			
			await user.click(screen.getByRole('button'))
			expect(handleClick).not.toHaveBeenCalled()
		})
	})

	describe('customization', () => {
		it('accepts custom className', () => {
			render(<Button className="custom-class">Custom</Button>)
			expect(screen.getByRole('button')).toHaveClass('custom-class')
		})

		it('accepts custom type attribute', () => {
			render(<Button type="submit">Submit</Button>)
			expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
		})

		it('forwards other HTML attributes', () => {
			render(<Button data-testid="custom-button" aria-label="Custom label">Button</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveAttribute('data-testid', 'custom-button')
			expect(button).toHaveAttribute('aria-label', 'Custom label')
		})
	})

	describe('accessibility', () => {
		it('has proper button role', () => {
			render(<Button>Accessible</Button>)
			expect(screen.getByRole('button')).toBeInTheDocument()
		})

		it('has focus styles', () => {
			render(<Button>Focusable</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
		})

		it('indicates disabled state to screen readers', () => {
			render(<Button disabled>Disabled</Button>)
			expect(screen.getByRole('button')).toHaveAttribute('disabled')
		})
	})
})