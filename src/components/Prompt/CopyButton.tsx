import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = 'Copied!', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(label)
      setTimeout(() => setCopied(false), 2000)
    }
    catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-1.5 rounded-md transition-all duration-200 hover:bg-gray-700/50 ${className}`}
      title='Copy to clipboard'
    >
      {copied
        ? (
            <Check className='w-4 h-4 text-green-400' />
          )
        : (
            <Copy className='w-4 h-4 text-gray-400 hover:text-blue-400' />
          )}
    </button>
  )
}
