import { SupportedVariableType } from '@/constants'
import InputField from '@annatarhe/lake-ui/form-input-field'
import SelectField from '@annatarhe/lake-ui/form-select-field'
import { Variable } from 'lucide-react'
import { Control, Controller } from 'react-hook-form'
import { mutatePromptType } from '../types'

interface VariablesSectionProps {
  control: Control<Pick<mutatePromptType, 'variables'>>
  variablesFields: Array<{ id: string }>
}

export function VariablesSection({
  control,
  variablesFields,
}: VariablesSectionProps) {
  return (
    <section className='relative w-full backdrop-blur-xl bg-linear-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 rounded-2xl overflow-hidden'>
      {/* Background blur effect */}
      <div className='absolute inset-0 bg-linear-to-br from-sky-500/5 to-blue-500/5 backdrop-blur-3xl' />

      {/* Content */}
      <div className='relative p-8'>
        <div className='flex flex-col gap-8'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-linear-to-br from-sky-500/10 to-blue-500/10'>
              <Variable size={24} className='text-sky-400' />
            </div>
            <h3 className='text-2xl font-bold tracking-tight bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent'>
              Variables
            </h3>
          </div>

          {/* Variables Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {variablesFields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className='group relative flex flex-col gap-3 w-full p-4 rounded-xl bg-linear-to-br from-gray-800/40 via-gray-800/20 to-gray-800/40 backdrop-blur-xl border border-gray-700/30 hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5'
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
                      <InputField
                        {...field}
                        disabled
                        placeholder='Variable name'
                      />
                    )}
                  />

                  {/* Variable type select */}
                  <Controller
                    control={control}
                    name={`variables.${index}.type`}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        placeholder='Select type'
                        options={SupportedVariableType.map(x => ({
                          value: x.toLowerCase(),
                          label: x,
                        }))}
                      />
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
