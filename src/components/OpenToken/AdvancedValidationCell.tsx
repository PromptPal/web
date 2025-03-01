import { useMutation } from '@apollo/client'
import { Input, Modal, Switch, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { graphql } from '../../gql'
import { OpenTokenUpdate } from '../../gql/graphql'
import ButtonGlow from '../Button/ButtonGlow'
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
  const [isOpen, { open, close: onClose }] = useDisclosure(false)

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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          error: (e: any) => e.toString(),
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
      <span className='w-full flex-1'>{renderPath}</span>
      {enabled && (
        <ButtonGlow
          className='px-4 py-2 rounded-sm font-bold text-sm cursor-pointer'
          onClick={() => {
            open()
          }}
        >
          Edit
        </ButtonGlow>
      )}
      {
        <Switch
          checked={enabled}
          onChange={() => doUpdate({ apiValidateEnabled: !enabled })}
        />
      }
      {
        <ButtonGlow
          loading={deleting}
          className='px-4 py-2 rounded-sm font-bold text-sm cursor-pointer'
          onClick={() => {
            doDel()
          }}
          color='red'
        >
          Delete
        </ButtonGlow>
      }
      <Modal
        opened={isOpen}
        onClose={onClose}
        centered
        title='Update Open Token'
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 8,
        }}
      >
        <OpenTokenUpdateForm
          validatePath={validatePath}
          enabled={enabled}
          onClose={onClose}
          onSubmit={(data) => doUpdate(data)}
          isSubmitting={loading}
        />
      </Modal>
    </div>
  )
}

export default AdvancedValidationCell
