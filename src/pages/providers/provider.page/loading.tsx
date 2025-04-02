import { BackButton } from '../components/BackButton'

function Loading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-2 mb-8'>
        <BackButton disabled />
      </div>

      {/* Loading Header */}
      <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-primary/10 to-background/5 overflow-hidden mb-6 shadow-lg'>
        <div className='rounded-lg bg-card/80 p-6 backdrop-blur-md'>
          <div className='animate-pulse space-y-4'>
            <div className='flex justify-between'>
              <div className='space-y-2'>
                <div className='h-6 bg-background/20 rounded-md w-48'></div>
                <div className='h-4 bg-background/20 rounded-md w-32'></div>
              </div>
              <div className='flex gap-2'>
                <div className='h-10 bg-background/20 rounded-md w-24'></div>
                <div className='h-10 bg-background/20 rounded-md w-24'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          {/* Loading Provider Details */}
          <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-secondary/10 to-background/5 overflow-hidden shadow-md'>
            <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl'>
              <div className='h-5 bg-background/20 rounded-md w-36 mb-4'></div>
              <div className='space-y-4 animate-pulse'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='space-y-2'>
                    <div className='h-4 bg-background/20 rounded-md w-24'></div>
                    <div className='h-5 bg-background/20 rounded-md w-full'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Loading Configuration */}
          <div className='rounded-xl p-[2px] bg-gradient-to-br from-primary/20 via-secondary/10 to-background/5 overflow-hidden shadow-md'>
            <div className='rounded-lg bg-card/80 p-6 backdrop-blur-xl'>
              <div className='h-5 bg-background/20 rounded-md w-36 mb-4'></div>
              <div className='bg-muted/50 rounded-md p-4 h-32 animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
