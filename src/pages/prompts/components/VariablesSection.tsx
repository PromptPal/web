import { SupportedVariableType } from '@/constants'
import { cn } from '@/utils'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Settings2, Variable } from 'lucide-react'
import { Control, Controller } from 'react-hook-form'
import { mutatePromptType } from '../types'

interface VariablesSectionProps {
  control: Control<mutatePromptType>
  variablesFields: Array<{ id: string }>
}

export function VariablesSection({
  control,
  variablesFields,
}: VariablesSectionProps) {
  const [variablesAnimateParent] = useAutoAnimate()
  return (
    <section className='relative w-full backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-2xl overflow-hidden'>
      {/* Background blur effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-3xl' />

      {/* Content */}
      <div className='relative p-8'>
        <div className='flex flex-col gap-8'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10'>
              <Variable size={24} className='text-blue-400' />
            </div>
            <h3 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              Variables
            </h3>
          </div>

          {/* Variables Grid */}
          <div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            ref={variablesAnimateParent}
          >
            {variablesFields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className='group relative flex flex-col gap-3 w-full p-4 rounded-xl bg-gradient-to-br from-gray-800/40 via-gray-800/20 to-gray-800/40 backdrop-blur-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5'
                >
                  {/* Settings icon */}
                  {/* <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Settings2 size={16} className='text-gray-400' />
                  </div> */}

                  {/* Variable name input */}
                  <Controller
                    control={control}
                    name={`variables.${index}.name`}
                    render={({ field }) => (
                      <div className='relative'>
                        <input
                          type='text'
                          {...field}
                          disabled
                          className={cn(
                            'w-full px-4 py-2.5 rounded-lg',
                            'bg-gray-900/50 border border-gray-700/50',
                            'text-gray-200 disabled:opacity-70',
                            'transition-colors duration-200',
                            'focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none',
                          )}
                        />
                      </div>
                    )}
                  />

                  {/* Variable type select */}
                  <Controller
                    control={control}
                    name={`variables.${index}.type`}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={cn(
                          'w-full px-4 py-2.5 rounded-lg appearance-none',
                          'bg-gray-900/50 border border-gray-700/50',
                          'text-gray-200',
                          'transition-colors duration-200',
                          'focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none',
                          'hover:border-gray-600/50',
                        )}
                      >
                        {SupportedVariableType.map((x) => (
                          <option
                            key={x}
                            value={x.toLowerCase()}
                            className='bg-gray-900 text-gray-200'
                          >
                            {x}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
