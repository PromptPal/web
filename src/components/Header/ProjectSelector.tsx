import { graphql } from '@/gql'
import { useQuery as useGraphQLQuery } from '@apollo/client'
import {
  Link,
  useLocation,
  useMatch,
  useNavigate,
} from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Folders } from 'lucide-react'
import { useCallback } from 'react'
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
  const m = useMatch({ from: '/projects/', shouldThrow: false })
  const location = useLocation()
  const nav = useNavigate()

  const navigateToProject = useCallback(
    (id?: number) => {
      nav({ to: `/${id}/view` })
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
      if (location.pathname === '/' && projects.length > 0) {
        navigateToProject(projects[0].id)
      }
    },
  })

  const projects = projectsData?.projects.edges ?? []
  if (projects.length === 0) {
    return null
  }

  return (
    <Link
      to='/projects'
      className={`
        group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all
        ring-primary-500/20 hover:ring-2
        hover:bg-linear-to-r hover:from-primary-50/80 hover:to-primary-100/80
        dark:hover:from-primary-950/50 dark:hover:to-primary-900/50
        hover:text-primary-500 dark:hover:text-primary-400
        ${
    m
      ? 'bg-linear-to-r from-primary-50 to-primary-100 dark:from-primary-950/50 dark:to-primary-900/50 text-primary-600 dark:text-primary-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-linear-to-r after:from-primary-500 after:to-primary-600 dark:text-primary-300'
      : 'text-gray-600 dark:text-gray-400'
    }
      `}
    >
      <Folders className='h-4 w-4 transition-all group-hover:scale-110 group-hover:rotate-3' />
      <span>Projects</span>
    </Link>
  )
}

export default ProjectSelector
