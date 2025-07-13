import Button from '@/components/Button/Button'
import LakeModal from '@annatarhe/lake-ui/modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod/v4'
import { MockRole } from '../permissions.query'
import { RoleSelector } from './RoleSelector'

type Role = MockRole

const assignPermissionSchema = z.object({
  selectedRole: z.string().min(1, 'Please select a role'),
})

type AssignPermissionFormData = z.infer<typeof assignPermissionSchema>

interface AssignPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
  projectId: string
  availableRoles: Role[]
  onPermissionAssigned: () => void
}

export function AssignPermissionModal({
  isOpen,
  onClose,
  userId,
  availableRoles,
  onPermissionAssigned,
}: AssignPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssignPermissionFormData>({
    resolver: zodResolver(assignPermissionSchema),
    defaultValues: {
      selectedRole: '',
    },
  })

  const selectedRole = watch('selectedRole')

  const onSubmit = async () => {
    if (!userId) return

    setIsLoading(true)

    // Mock assign permission functionality
    setTimeout(() => {
      toast.success('Permission assigned successfully (Demo)')
      onPermissionAssigned()
      setIsLoading(false)
    }, 1000)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <LakeModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Assign Permission'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6 gap-4'>
        <p className='text-sm text-gray-400'>
          Select a role to assign to the user for this project
        </p>

        <Controller
          name='selectedRole'
          control={control}
          render={({ field }) => (
            <RoleSelector
              roles={availableRoles}
              selectedRole={field.value}
              onRoleSelect={field.onChange}
              error={errors.selectedRole?.message}
            />
          )}
        />

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={handleClose}
            className='flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors'
          >
            <X className='w-4 h-4' />
            Cancel
          </button>
          <Button
            type='submit'
            isLoading={isLoading}
            disabled={!selectedRole}
            className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors'
          >
            <Check className='w-4 h-4' />
            Assign Role
          </Button>
        </div>
      </form>
    </LakeModal>
  )
}
