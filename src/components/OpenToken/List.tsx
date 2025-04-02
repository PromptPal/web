import Tooltip from '@annatarhe/lake-ui/tooltip'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { HelpCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { OpenToken } from '../../gql/graphql'
import SimpleTable from '../Table/SimpleTable'
import AdvancedValidationCell from './AdvancedValidationCell'
import CreateOpenTokenModal from './CreateOpenTokenModal'

type OpenTokenListOfProjectProps = {
  pid: number
  openTokens: OpenToken[]
}

const columnHelper = createColumnHelper<OpenToken>()
const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'token',
    header: 'Token',
    cell: '-',
  }),
  columnHelper.accessor('apiValidateEnabled', {
    header: () => (
      <Tooltip
        content={
          <div className='space-y-2'>
            <p>Advanced Validation Path read more:</p>
            <a
              href='https://promptpal.github.io/docs/developer-tools/security'
              target='_blank'
              rel='noreferrer'
              className='text-blue-400 hover:text-blue-300 transition-colors'
            >
              Advanced API Security
            </a>
          </div>
        }
      >
        <div className='flex justify-center items-center flex-row text-gray-300'>
          <span>Advanced Validation Path</span>
          <HelpCircle className='w-4 h-4 ml-2' />
        </div>
      </Tooltip>
    ),
    cell: (info) => {
      const enabled = info.getValue()
      const validatePath = info.row.original.apiValidatePath
      return (
        <AdvancedValidationCell
          id={info.row.original.id}
          validatePath={validatePath}
          enabled={enabled}
        />
      )
    },
  }),
]

function OpenTokenListOfProject(props: OpenTokenListOfProjectProps) {
  const { pid, openTokens } = props
  const table = useReactTable({
    data: openTokens,
    getCoreRowModel: getCoreRowModel(),
    columns,
  })

  // const [isOpen, { close: onClose, open: onOpen }] = useDisclosure()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <section className='w-full backdrop-blur-xs bg-linear-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 shadow-xl rounded-xl overflow-hidden'>
        <div className='p-6 border-b border-gray-700/50'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500'>
              Open Tokens
            </h2>
            <button
              onClick={() => setIsOpen(true)}
              disabled={(openTokens?.length ?? 0) >= 20}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
            >
              <Plus className='w-4 h-4' />
              New Token
            </button>
          </div>
        </div>
        <div className='p-6'>
          <SimpleTable table={table} />
        </div>
      </section>

      <CreateOpenTokenModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectId={~~pid}
      />
    </>
  )
}

export default OpenTokenListOfProject
