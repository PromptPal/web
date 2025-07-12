import { describe, it, expect } from 'vitest'
import { cn } from './index'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  it('should merge conflicting Tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of class names', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })

  it('should handle object notation', () => {
    expect(cn({
      class1: true,
      class2: false,
      class3: true,
    })).toBe('class1 class3')
  })

  it('should filter out falsy values', () => {
    expect(cn('class1', null, undefined, '', 'class2')).toBe('class1 class2')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
  })

  it('should handle complex Tailwind class merging', () => {
    expect(cn(
      'px-4 py-2 bg-blue-500',
      'px-6 text-white',
      'hover:bg-blue-600',
    )).toBe('py-2 bg-blue-500 px-6 text-white hover:bg-blue-600')
  })
})
