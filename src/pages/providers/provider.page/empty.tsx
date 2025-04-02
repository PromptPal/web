import { Server } from 'lucide-react'
import { BackButton } from '../components/BackButton'

function Empty() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-2 mb-8'>
        <BackButton />
      </div>

      <div className='rounded-xl p-[2px] bg-gradient-to-br from-muted/30 via-muted/20 to-background/5 overflow-hidden shadow-lg'>
        <div className='rounded-lg bg-card/80 p-8 backdrop-blur-xl'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <div className='h-16 w-16 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center'>
              <Server className='h-8 w-8 text-muted-foreground' />
            </div>
            <h2 className='text-xl font-semibold'>Provider Not Found</h2>
            <p className='text-center text-muted-foreground max-w-md'>
              The provider you're looking for doesn't exist or has been deleted.
            </p>
            <a
              href='/providers'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 h-10 px-4 py-2'
            >
              View All Providers
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty
