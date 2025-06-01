import { Download, PlayCircle, Terminal } from 'lucide-react'
import Youtube from 'react-youtube'
function HelpIntegration() {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='p-4 rounded-full bg-primary/10 mb-6'>
        <Terminal className='w-8 h-8 text-primary' />
      </div>

      <h2 className='text-xl font-bold tracking-tight mb-2'>
        Getting Started with PromptPal
      </h2>
      <p className='text-muted-foreground max-w-[600px] mb-8'>
        No data found yet. Let&apos;s set up your project with PromptPal CLI and
        start tracking your prompts.
      </p>

      <div className='grid gap-8 w-full max-w-[800px] mb-8'>
        <div className='flex items-start gap-4 text-left'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <PlayCircle className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h3 className='font-medium mb-1'>Watch the Tutorial</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Learn how to use PromptPal with our quick start video guide
            </p>
            <div className='rounded-lg overflow-hidden border border-border'>
              <Youtube
                className='aspect-video w-full'
                videoId='IjfrQNRUg_I'
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    modestbranding: 1,
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className='flex items-start gap-4 text-left'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <Download className='w-5 h-5 text-primary' />
          </div>
          <div>
            <h3 className='font-medium mb-1'>Install PromptPal CLI</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Download and install the CLI tool to start managing your prompts
            </p>
            <div className='grid gap-2'>
              <a
                href='https://github.com/PromptPal/cli/releases'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 text-sm text-primary hover:underline'
              >
                Download from GitHub
              </a>
              <div className='p-4 rounded-lg bg-muted font-mono text-sm'>
                <p className='mb-2'>
                  # Move to your project directory and initialize
                </p>
                <p className='text-muted-foreground'>$ promptpal init</p>
                <p className='text-muted-foreground'>$ promptpal g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpIntegration
