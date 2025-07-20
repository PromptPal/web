import { cn } from '@/utils'
import InputField from '@annatarhe/lake-ui/form-input-field'
import { Info } from 'lucide-react'

interface AdvancedSettingsProps {
  temperature: number
  topP: number
  maxTokens?: number
  onTemperatureChange: (value: number) => void
  onTopPChange: (value: number) => void
  onMaxTokensChange: (value: number | undefined) => void
  errors: {
    openAITemperature?: { message?: string }
    openAITopP?: { message?: string }
    openAIMaxTokens?: { message?: string }
  }
}

function AdvancedSettings({
  temperature,
  topP,
  maxTokens,
  onTemperatureChange,
  onTopPChange,
  onMaxTokensChange,
  errors,
}: AdvancedSettingsProps) {
  return (
    <div className='space-y-6 rounded-xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-orange-500/20 p-6 backdrop-blur-xl shadow-lg'>
      <h3 className='text-base font-semibold text-foreground bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
        Model Parameters
      </h3>

      <div className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>
                Temperature
              </label>
              <div className='group relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                <div
                  className='absolute bottom-full left-0 mb-2 px-4 py-2.5 rounded-xl
                bg-popover/90 text-popover-foreground border-none text-sm min-w-[16rem] hidden
                group-hover:block shadow-xl backdrop-blur-xl z-10 transform transition-all duration-200'
                >
                  Controls randomness: Higher values (e.g., 0.8) make output
                  more random, lower values (e.g., 0.2) make it more focused and
                  deterministic.
                </div>
              </div>
            </div>
            <span className='text-sm font-medium'>
              {temperature.toFixed(1)}
            </span>
          </div>

          <div className='relative pt-1'>
            <input
              type='range'
              min='0'
              max='2'
              step='0.1'
              value={temperature}
              onChange={e => onTemperatureChange(parseFloat(e.target.value))}
              className={cn(
                'w-full h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-lg appearance-none cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'transition-all duration-300 ease-in-out',
              )}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-2'>
              <span>0</span>
              <span>1</span>
              <span>2</span>
            </div>
          </div>

          {errors.openAITemperature && (
            <p className='text-sm text-destructive mt-1'>
              {errors.openAITemperature.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <label className='text-sm font-medium leading-none'>Top P</label>
              <div className='group relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-primary transition-colors' />
                <div
                  className='absolute bottom-full left-0 mb-2 px-4 py-2.5 rounded-xl
                bg-popover/90 text-popover-foreground border-none text-sm min-w-[16rem] hidden
                group-hover:block shadow-xl backdrop-blur-xl z-10 transform transition-all duration-200'
                >
                  Controls diversity via nucleus sampling: 0.5 means half of all
                  likelihood-weighted options are considered.
                </div>
              </div>
            </div>
            <span className='text-sm font-medium'>{topP.toFixed(1)}</span>
          </div>

          <div className='relative pt-1'>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={topP}
              onChange={e => onTopPChange(parseFloat(e.target.value))}
              className={cn(
                'w-full h-3 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-lg appearance-none cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                'transition-all duration-300 ease-in-out',
              )}
            />
            <div className='flex justify-between text-xs text-muted-foreground mt-2'>
              <span>0</span>
              <span>0.5</span>
              <span>1</span>
            </div>
          </div>

          {errors.openAITopP && (
            <p className='text-sm text-destructive mt-1'>
              {errors.openAITopP.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <InputField
            label={(
              <div className='flex items-center gap-1'>
                <span className='text-sm font-medium leading-none'>Max Tokens</span>
                <div className='group relative'>
                  <Info className='w-4 h-4 text-muted-foreground' />
                  <div
                    className='absolute bottom-full left-0 mb-2 px-3 py-1.5 rounded-lg
                  bg-popover/80 text-popover-foreground border border-border/40 text-sm min-w-[16rem] hidden
                  group-hover:block shadow-lg backdrop-blur-md z-10'
                  >
                    The maximum number of tokens to generate. Leave empty for model
                    default.
                  </div>
                </div>
              </div>
            )}
            type='number'
            value={maxTokens || ''}
            onChange={(e) => {
              const value = e.target.value
                ? parseInt(e.target.value)
                : undefined
              onMaxTokensChange(value)
            }}
            placeholder='Model default'
            min='0'
            error={errors.openAIMaxTokens?.message}
          />
        </div>
      </div>
    </div>
  )
}

export default AdvancedSettings
