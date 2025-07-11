import { ChevronRight, FolderOpen, MessageSquare, TrendingUp } from 'lucide-react'
import { DetailCard } from './DetailCard'

type UsageCardProps = {
  projects?: { count: number } | null
  prompts?: { count: number } | null
}

export function UsageCard({ projects, prompts }: UsageCardProps) {
  const projectCount = projects?.count || 0
  const promptCount = prompts?.count || 0
  const totalUsage = projectCount + promptCount

  return (
    <DetailCard title='Usage Statistics'>
      <div className='space-y-4'>
        {/* Summary Card */}
        <div className='p-4 rounded-xl bg-gradient-to-r from-sky-50/80 to-blue-50/80 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-200/50 dark:border-sky-800/50'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-lg bg-sky-100/80 dark:bg-sky-900/40'>
              <TrendingUp className='h-4 w-4 text-sky-600 dark:text-sky-400' />
            </div>
            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Total Items
            </div>
          </div>
          <div className='ml-11'>
            <div className='text-2xl font-bold text-gray-900 dark:text-white'>{totalUsage}</div>
            <div className='text-xs text-gray-500 dark:text-gray-500 mt-1'>Projects and prompts combined</div>
          </div>
        </div>

        {/* Projects Card */}
        <div className='p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/40'>
                <FolderOpen className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>Projects</div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>{projectCount}</div>
              </div>
            </div>
            {projectCount > 0 && (
              <button className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline inline-flex items-center transition-colors group'>
                View All
                <ChevronRight className='h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5' />
              </button>
            )}
          </div>
        </div>

        {/* Prompts Card */}
        <div className='p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40'>
                <MessageSquare className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
              </div>
              <div>
                <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>Prompts</div>
                <div className='text-lg font-bold text-gray-900 dark:text-white'>{promptCount}</div>
              </div>
            </div>
            {promptCount > 0 && (
              <button className='text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline inline-flex items-center transition-colors group'>
                View All
                <ChevronRight className='h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5' />
              </button>
            )}
          </div>
        </div>
      </div>
    </DetailCard>
  )
}
