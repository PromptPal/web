import { Calendar, Clock, Pencil } from 'lucide-react'
import { DetailCard } from './DetailCard'

type MetadataCardProps = {
  createdAt: string
  updatedAt: string
}

export function MetadataCard({ createdAt, updatedAt }: MetadataCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date),
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const created = formatDate(createdAt)
  const updated = formatDate(updatedAt)

  return (
    <DetailCard title='Metadata'>
      <div className='space-y-4'>
        <div className='p-4 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-green-100/80 dark:bg-green-900/40'>
              <Calendar className='h-4 w-4 text-green-600 dark:text-green-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Created
            </div>
            <div className='ml-auto text-xs text-gray-500 dark:text-gray-500 bg-green-100/60 dark:bg-green-900/20 px-2 py-1 rounded-full'>
              {created.relative}
            </div>
          </div>
          <div className='ml-11 space-y-1'>
            <div className='text-sm font-medium text-gray-900 dark:text-white'>{created.date}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {created.time}
            </div>
          </div>
        </div>

        <div className='p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/40'>
              <Pencil className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Last Updated
            </div>
            <div className='ml-auto text-xs text-gray-500 dark:text-gray-500 bg-blue-100/60 dark:bg-blue-900/20 px-2 py-1 rounded-full'>
              {updated.relative}
            </div>
          </div>
          <div className='ml-11 space-y-1'>
            <div className='text-sm font-medium text-gray-900 dark:text-white'>{updated.date}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1'>
              <Clock className='w-3 h-3' />
              {updated.time}
            </div>
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
