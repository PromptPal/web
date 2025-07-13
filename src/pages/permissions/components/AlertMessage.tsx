import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  className?: string
}

export function AlertMessage({ type, title, message, className = '' }: AlertMessageProps) {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />,
          title: 'text-green-800 dark:text-green-200',
          message: 'text-green-700 dark:text-green-300',
        }
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400' />,
          title: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300',
        }
      case 'warning':
        return {
          container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: <AlertTriangle className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />,
          title: 'text-yellow-800 dark:text-yellow-200',
          message: 'text-yellow-700 dark:text-yellow-300',
        }
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: <Info className='w-5 h-5 text-blue-600 dark:text-blue-400' />,
          title: 'text-blue-800 dark:text-blue-200',
          message: 'text-blue-700 dark:text-blue-300',
        }
    }
  }

  const styles = getAlertStyles()

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className='flex items-start gap-3'>
        {styles.icon}
        <div className='flex-1'>
          {title && (
            <h3 className={`font-semibold mb-1 ${styles.title}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.message}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
