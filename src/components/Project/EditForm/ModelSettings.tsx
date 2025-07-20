import { OpenAIModels } from '@/constants'
import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ExternalLink, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ModelSettingsProps {
  model?: string | null
  openAIBaseURL?: string | null
  openAIToken?: string | null
  geminiBaseURL?: string | null
  geminiToken?: string | null
  onModelChange: (value: string) => void
  onOpenAIBaseURLChange: (value: string) => void
  onOpenAITokenChange: (value: string) => void
  onGeminiBaseURLChange: (value: string) => void
  onGeminiTokenChange: (value: string) => void
  errors: {
    openAIModel?: { message?: string }
    openAIBaseURL?: { message?: string }
    openAIToken?: { message?: string }
    geminiBaseURL?: { message?: string }
    geminiToken?: { message?: string }
  }
}

function ModelSettings({
  model,
  openAIBaseURL,
  openAIToken,
  geminiBaseURL,
  geminiToken,
  onModelChange,
  onOpenAIBaseURLChange,
  onOpenAITokenChange,
  onGeminiBaseURLChange,
  onGeminiTokenChange,
  errors,
}: ModelSettingsProps) {
  const [settingAreaRef] = useAutoAnimate()
  const [selectedModel, setSelectedModel] = useState(model)

  useEffect(() => {
    setSelectedModel(model)
  }, [model])

  return (
    <div className='space-y-8'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
            Model Provider
          </label>
          <a
            href='https://platform.openai.com/docs/models/overview'
            className='inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs group transition-all duration-200'
            target='_blank'
            rel='noreferrer'
          >
            Find more models
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
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value)
            onModelChange(e.target.value)
          }}
        >
          <option value=''>Select a model</option>
          {OpenAIModels.map(model => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        {errors.openAIModel && (
          <p className='text-sm text-destructive mt-1 font-medium'>
            {errors.openAIModel.message}
          </p>
        )}
      </div>

      <div ref={settingAreaRef} className='space-y-8'>
        {(selectedModel?.startsWith('gpt')
          || selectedModel?.startsWith('o3')) && (
          <div className='space-y-6 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 p-6 backdrop-blur-xl shadow-lg'>
            <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
              OpenAI Configuration
            </h3>

            <div className='space-y-2'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Base URL
                </label>
                <div className='group relative'>
                  <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                  <div
                    className='absolute bottom-full left-0 mb-2 px-4 py-2.5 rounded-xl
                  bg-popover/90 text-popover-foreground border-none text-sm min-w-[16rem] hidden
                  group-hover:block shadow-xl backdrop-blur-xl z-10 transform transition-all duration-200'
                  >
                    The base URL of the OpenAI API. You can set this for proxy
                    (大陆项目可以用此字段设置转发服务器代理)
                  </div>
                </div>
              </div>
              <InputField
                type='text'
                value={openAIBaseURL}
                onChange={e => onOpenAIBaseURLChange(e.target.value)}
                placeholder='https://api.openai.com/v1'
                error={errors.openAIBaseURL?.message}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium leading-none'>
                  OpenAI Token
                </label>
                <a
                  href='https://platform.openai.com/account/api-keys'
                  className='inline-flex items-center gap-1 text-primary hover:underline text-xs'
                  target='_blank'
                  rel='noreferrer'
                >
                  Create API key
                  <ExternalLink className='w-3 h-3' />
                </a>
              </div>
              <InputField
                type='password'
                value={openAIToken || ''}
                onChange={e => onOpenAITokenChange(e.target.value)}
                placeholder='sk-...'
                error={errors.openAIToken?.message}
              />
            </div>
          </div>
        )}

        {selectedModel?.startsWith('gemini') && (
          <div className='space-y-6 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 p-6 backdrop-blur-xl shadow-lg'>
            <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
              Gemini Configuration
            </h3>

            <div className='space-y-2'>
              <div className='flex items-center gap-1'>
                <label className='text-sm font-medium leading-none'>
                  Base URL
                </label>
                <div className='group relative'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                  <div
                    className='absolute bottom-full left-0 mb-2 px-3 py-1.5 rounded-lg
                  bg-popover/80 text-popover-foreground border border-border/40 text-sm min-w-[16rem] hidden
                  group-hover:block shadow-lg backdrop-blur-md z-10'
                  >
                    The base URL of the Google Gemini API. You can set this for
                    proxy (大陆项目可以用此字段设置转发服务器代理)
                  </div>
                </div>
              </div>
              <InputField
                type='text'
                value={geminiBaseURL}
                onChange={e => onGeminiBaseURLChange(e.target.value)}
                placeholder='https://generativelanguage.googleapis.com'
                error={errors.geminiBaseURL?.message}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium leading-none'>
                Gemini Token
              </label>
              <InputField
                type='password'
                value={geminiToken || ''}
                onChange={e => onGeminiTokenChange(e.target.value)}
                placeholder='Your Gemini API token'
                error={errors.geminiToken?.message}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelSettings
