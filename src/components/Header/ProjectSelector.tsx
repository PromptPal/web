import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import {
  Link,
  useLocation,
  useMatch,
  useNavigate,
} from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { ChevronDown, Folder, FolderOpen, Layers } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { tokenAtom } from '../../stats/profile'
import { useClickOutside } from '../../hooks/useClickOutside'

const q = graphql(`
  query allProjectsNameOnly($pagination: PaginationInput!) {
    projects(pagination: $pagination) {
      count
      edges {
        id
        name
        enabled
      }
    }
  }
`)

function ProjectSelector() {
  const logged = !!useAtomValue(tokenAtom)
  const isProjectsPage = useMatch({ from: '/projects/', shouldThrow: false })
  const currentProject = useMatch({ from: '/$pid', shouldThrow: false })
  const location = useLocation()
  const nav = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  const navigateToProject = useCallback(
    (id?: number) => {
      nav({ to: `/${id}/view` })
      setIsOpen(false)
    },
    [nav],
  )

  const { data: projectsData } = useGraphQLQuery(q, {
    variables: {
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    skip: !logged,
    onCompleted(data) {
      // init project if not set before
      const projects = data?.projects.edges ?? []
      if (location.pathname === '/' && projects.length > 0) {
        navigateToProject(projects[0].id)
      }
    },
  })

  const projects = projectsData?.projects.edges ?? []
  const currentProjectData = projects.find(
    p => p.id === Number(currentProject?.params.pid),
  )

  if (projects.length === 0) {
    return null
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
          transition-all duration-200 outline-none
          focus-visible:ring-2 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400
          ${
    isProjectsPage || isOpen
      ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }
        `}
      >
        <Layers className='h-4 w-4' strokeWidth={2} />
        <span className='hidden lg:inline'>
          {currentProjectData ? currentProjectData.name : 'Projects'}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute left-0 mt-2 w-64 origin-top-left animate-in fade-in slide-in-from-top-1 duration-200'>
          <div className='rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-1.5'>
            <div className='px-3 py-2 border-b border-gray-100 dark:border-gray-800'>
              <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Your Projects
              </h3>
            </div>

            <div className='max-h-64 overflow-y-auto py-1'>
              {projects.map((project) => {
                const isActive = currentProjectData?.id === project.id
                return (
                  <button
                    key={project.id}
                    onClick={() => navigateToProject(project.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                      transition-all duration-150 outline-none
                      ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                    `}
                  >
                    {isActive
                      ? (
                          <FolderOpen className='h-4 w-4 flex-shrink-0' strokeWidth={2} />
                        )
                      : (
                          <Folder className='h-4 w-4 flex-shrink-0' strokeWidth={2} />
                        )}
                    <span className='flex-1 text-left truncate'>{project.name}</span>
                    {!project.enabled && (
                      <span className='text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                        Disabled
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className='border-t border-gray-100 dark:border-gray-800 p-1.5'>
              <Link
                to='/projects'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'
              >
                <Layers className='h-4 w-4' strokeWidth={2} />
                <span>Manage All Projects</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectSelector
