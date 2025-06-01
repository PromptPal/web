import Modal from '@annatarhe/lake-ui/modal'
import { AlertTriangle } from 'lucide-react'

type DeleteModalProps = {
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeleteModal({
  isOpen,
  isDeleting,
  onClose,
  onDelete,
}: DeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={(
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center'>
            <AlertTriangle className='h-5 w-5 text-destructive' />
          </div>
          <h3 className='text-lg font-semibold'>Delete Provider</h3>
        </div>
      )}
    >
      <div className='bg-card/90 rounded-xl shadow-lg w-full p-6 space-y-4 border border-primary/10 backdrop-blur-xl'>
        <p className='text-muted-foreground'>
          Are you sure you want to delete this provider? This action cannot be
          undone and may affect any projects or prompts using this provider.
        </p>
        <div className='flex justify-end gap-3 pt-2'>
          <button
            onClick={onClose}
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/80 h-10 px-4 py-2'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
