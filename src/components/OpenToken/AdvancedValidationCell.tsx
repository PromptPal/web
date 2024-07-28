import { useMutation } from '@apollo/client'
import { Input, Modal, Switch, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useCallback } from 'react'
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

function AdvancedValidationCell(props: AdvancedValidationCellProps) {
  const { id, validatePath, enabled } = props
  const [updateOpenToken, { loading }] = useMutation(updateMuataion, {
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
          error: (e) => e.toString(),
        },
      )
    },
    [id],
  )

  return (
    <div>
      <span>{validatePath}</span>
      {enabled && (
        <ButtonGlow
          className='px-4 py-2 rounded font-bold text-sm cursor-pointer'
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
