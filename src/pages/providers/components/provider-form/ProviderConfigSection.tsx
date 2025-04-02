import { cn } from '@/utils'
import Tooltip from '@annatarhe/lake-ui/tooltip'
import { ExternalLink, Info } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { ProviderFormValues } from './schema'

type ProviderConfigSectionProps = {
  form: UseFormReturn<ProviderFormValues>
  configSectionRef: React.RefCallback<HTMLDivElement>
}

export const ProviderConfigSection = ({
  form,
  configSectionRef,
}: ProviderConfigSectionProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = form

  // Watch source value for conditional rendering
  const source = watch('source')

  return (
    <div
      ref={configSectionRef}
      className='space-y-6 rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-orange-500/20 p-6 backdrop-blur-xl shadow-lg'
    >
      <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
        Provider Configuration
      </h3>

      <div className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>Source</label>
              <Tooltip content='The source of the provider (e.g., OpenAI, Anthropic, etc.)'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            <a
              href='https://platform.openai.com/docs/models/overview'
              className='inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs group transition-all duration-200'
              target='_blank'
              rel='noreferrer'
            >
              View providers
              <ExternalLink className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
            </a>
          </div>
          <select
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-lg',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            {...register('source')}
            aria-invalid={errors.source ? 'true' : 'false'}
          >
            <option value='openai'>OpenAI</option>
            <option value='anthropic'>Anthropic</option>
            <option value='gemini'>Gemini</option>
            <option value='deepseek'>DeepSeek</option>
            <option value='custom'>Custom</option>
          </select>
          {errors.source && (
            <p className='text-sm text-destructive mt-1'>
              {errors.source.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <label className='text-sm font-medium leading-none'>
              Endpoint URL
            </label>
            <Tooltip content='Endpoint URL for the provider.'>
              <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
            </Tooltip>
          </div>
          <input
            type='url'
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            {...register('endpoint')}
            aria-invalid={errors.endpoint ? 'true' : 'false'}
            placeholder='https://api.openai.com'
          />
          {errors.endpoint && (
            <p className='text-sm text-destructive mt-1'>
              {errors.endpoint.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                API Key
              </label>
              <Tooltip content='API Key for authentication with the provider'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
              </Tooltip>
            </div>
            {source === 'openai' && (
              <a
                href='https://platform.openai.com/account/api-keys'
                className='inline-flex items-center gap-1 text-primary hover:underline text-xs'
                target='_blank'
                rel='noreferrer'
              >
                Create API key
                <ExternalLink className='w-3 h-3' />
              </a>
            )}
          </div>
          <input
            type='password'
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            {...register('apiKey')}
            aria-invalid={errors.apiKey ? 'true' : 'false'}
            placeholder='sk-...'
          />
          {errors.apiKey && (
            <p className='text-sm text-destructive mt-1'>
              {errors.apiKey.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <label className='text-sm font-medium leading-none'>
              Organization ID
            </label>
            <Tooltip content='Optional organization ID for the provider'>
              <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
            </Tooltip>
          </div>
          <input
            type='text'
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            {...register('organizationId')}
            aria-invalid={errors.organizationId ? 'true' : 'false'}
            placeholder='org-...'
          />
          {errors.organizationId && (
            <p className='text-sm text-destructive mt-1'>
              {errors.organizationId.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-1'>
            <label className='text-sm font-medium leading-none'>
              Default Model
            </label>
            <Tooltip content='Default model for the provider'>
              <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
            </Tooltip>
          </div>
          <input
            type='text'
            className={cn(
              'flex h-12 w-full rounded-xl bg-background/30 px-4 py-2',
              'text-sm ring-offset-background focus-visible:outline-hidden',
              'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'backdrop-blur-lg transition-all duration-300 ease-in-out',
              'hover:bg-background/50 border-none shadow-md',
              'bg-gradient-to-r from-background/40 to-background/20',
            )}
            {...register('defaultModel')}
            aria-invalid={errors.defaultModel ? 'true' : 'false'}
            placeholder='gpt-4'
          />
          {errors.defaultModel && (
            <p className='text-sm text-destructive mt-1'>
              {errors.defaultModel.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
