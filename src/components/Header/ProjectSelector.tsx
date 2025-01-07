import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import { Center, Divider, Select } from '@mantine/core'
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { tokenAtom } from '../../stats/profile'

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
  const location = useLocation()

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const sq = useSearch({ strict: false }) as any
  console.log('sq', sq)
  const pjId = sq.pjId
  const nav = useNavigate()

  const navigateToProject = useCallback(
    (id?: number) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      nav({ search: { pjId: id ? id : undefined } as any })
      // setSq({
      //   pjId: id ? id.toString() : '',
      // })
    },
    [location.search, location.pathname],
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
      const pjId = new URLSearchParams(location.search).get('pjId')
      if (!pjId && projects.length > 0) {
        navigateToProject(projects[0].id)
      }
    },
  })

  const projects = projectsData?.projects.edges ?? []
  const currentProject = projects.find((x) => x.id === Number(pjId))

  const onProjectChange = useCallback((val: number) => {
    if (!val) {
      navigateToProject(undefined)
    } else {
      navigateToProject(val)
    }
  }, [])
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false)

  if (projects.length === 0) {
    return null
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
        className='flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200'
      >
        <span>{currentProject?.name}</span>
        <ChevronDown size={16} />
      </button>

      {isProjectMenuOpen && (
        <div className='absolute mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5'>
          <div className='py-1' role='menu'>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectChange(project.id)
                  setIsProjectMenuOpen(false)
                }}
                className='block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600'
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectSelector
