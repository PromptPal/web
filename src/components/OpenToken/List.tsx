import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Button, Stack, Switch, Text, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { OpenToken } from '../../gql/graphql'
import ButtonGlow from '../Button/ButtonGlow'
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
    // add a tooltip
    header: () => (
      <Tooltip
        label={
          <div>
            <span>Advanced Validation Path read more:</span>
            <a
              href='https://promptpal.github.io/docs/developer-tools/security'
              target='_blank'
              rel='noreferrer'
            >
              Advanced API Security
            </a>
          </div>
        }
      >
        <Text>Advanced Validation Path</Text>
        <QuestionMarkCircleIcon className='w-4 h-4 ml-2' />
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

  const [isOpen, { close: onClose, open: onOpen }] = useDisclosure()

  return (
    <>
      <Stack>
        <div className='w-full flex justify-between items-center'>
          <Title order={4} size='xl'>
            Open Tokens
          </Title>
          <ButtonGlow
            className=' px-4 py-2 rounded font-bold text-sm cursor-pointer'
            disabled={(openTokens?.length ?? 0) >= 20}
            onClick={onOpen}
          >
            New Token
          </ButtonGlow>
        </div>
        <SimpleTable table={table} />
      </Stack>

      <CreateOpenTokenModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={~~pid}
      />
    </>
  )
}

export default OpenTokenListOfProject
