import { AlertTriangle } from 'lucide-react'
import { BackButton } from '../components/BackButton'

type Props = {
  error: Error
}

function ErrorPage({ error }: Props) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-2 mb-8'>
        <BackButton />
      </div>

      <div className='rounded-xl p-[2px] bg-gradient-to-br from-destructive/30 via-destructive/20 to-background/5 overflow-hidden shadow-lg'>
        <div className='rounded-lg bg-card/80 p-8 backdrop-blur-xl'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <div className='h-16 w-16 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center'>
              <AlertTriangle className='h-8 w-8 text-destructive' />
            </div>
            <h2 className='text-xl font-semibold'>Error Loading Provider</h2>
            <p className='text-center text-muted-foreground max-w-md'>
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 h-10 px-4 py-2'
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
