import Switch from '@annatarhe/lake-ui/form-switch-field'
import LakeModal from '@annatarhe/lake-ui/modal'
import { useMutation } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { graphql } from '../../gql'
import { OpenTokenUpdate } from '../../gql/graphql'
import OpenTokenUpdateForm from './UpdateForm'

type AdvancedValidationCellProps = {
  id: number
  validatePath: string
  enabled: boolean
}

const updateMuataion = graphql(`
  mutation updateOpenToken($id: Int!, $data: openTokenUpdate!) {
    updateOpenToken(id: $id, data: $data) {
      id
      name
      description
      apiValidateEnabled
      apiValidatePath
      expireAt
    }
  }
`)

const delMuataion = graphql(`
  mutation deleteOpenToken($id: Int!) {
    deleteOpenToken(id: $id)
  }
`)

function AdvancedValidationCell(props: AdvancedValidationCellProps) {
  const { id, validatePath, enabled } = props
  const [updateOpenToken, { loading }] = useMutation(updateMuataion, {
    refetchQueries: ['fetchProject'],
  })
  const [doDel, { loading: deleting }] = useMutation(delMuataion, {
    variables: { id },
    refetchQueries: ['fetchProject'],
  })
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])

  const doUpdate = useCallback(
    (data: OpenTokenUpdate) => {
      return toast.promise(
        updateOpenToken({
          variables: {
            id,
            data,
          },
        }),
        {
          loading: 'Updating',
          success: 'Updated',
          error: (e: Error) => e.toString(),
        },
      )
    },
    [id],
  )
  const renderPath = useMemo(() => {
    if (!enabled) {
      return ''
    }
    return validatePath
  }, [validatePath, enabled])

  return (
    <div className='flex items-center gap-4 w-full'>
      <span className='w-full flex-1 text-gray-200'>{renderPath}</span>
      {enabled && (
        <button
          className='px-4 py-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-105'
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Edit
        </button>
      )}
      <Switch
        value={enabled}
        onChange={() => doUpdate({ apiValidateEnabled: !enabled })}
        label='Enable'
      />
      <button
        disabled={deleting}
        className='px-4 py-2 rounded-lg font-medium text-sm cursor-pointer backdrop-blur-sm bg-gradient-to-r from-red-500/90 to-rose-600/90 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition-all duration-200 transform hover:scale-105'
        onClick={() => {
          doDel()
        }}
        color='red'
      >
        Delete
      </button>
      <LakeModal
        isOpen={isOpen}
        onClose={onClose}
        title={(
          <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
            Update Open Token
          </span>
        )}
      >
        <OpenTokenUpdateForm
          validatePath={validatePath}
          enabled={enabled}
          onClose={onClose}
          onSubmit={data => doUpdate(data)}
          isSubmitting={loading}
        />
      </LakeModal>
    </div>
  )
}

export default AdvancedValidationCell
