import LakeModal from '@annatarhe/lake-ui/modal'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CREATE_USER } from '../permissions.query'
import { CreateUserFormData, CreatedUser } from '../types/user-creation'
import { UserCreatedSuccess } from './UserCreatedSuccess'
import UserCreationForm from './UserCreationForm'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
  projectId: string
}

function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null)
  const [createUser, { loading: isLoading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      const newUser = {
        user: {
          id: data.createUser.user.id.toString(),
          name: data.createUser.user.name,
          email: data.createUser.user.email,
        },
        password: data.createUser.password,
      }

      setCreatedUser(newUser)
      toast.success(`User ${newUser.user.name} created successfully`)
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user. Please try again.')
    },
  })

  const onSubmit = async (data: CreateUserFormData) => {
    createUser({
      variables: {
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          lang: data.lang,
          level: data.level,
          avatar: data.avatar || undefined,
          username: data.username || undefined,
        },
      },
    })
  }

  const handleClose = () => {
    if (createdUser) {
      onUserCreated()
    }
    setCreatedUser(null)
    onClose()
  }

  return (
    <LakeModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Create New User'
    >
      {createdUser
        ? (
            <UserCreatedSuccess user={createdUser} onClose={handleClose} />
          )
        : (
            <UserCreationForm
              onSubmit={onSubmit}
              onCancel={handleClose}
              isLoading={isLoading}
            />
          )}
    </LakeModal>
  )
}

export default CreateUserModal
