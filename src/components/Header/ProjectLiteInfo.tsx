import { useProjectId } from '../../hooks/route'
import { useQuery } from '@apollo/client'
import { graphql } from '../../gql'

const q = graphql(`
query getProjectName($id: Int!) {
  project(id: $id) {
  id
  name
  }
}
`)

function ProjectLiteInfo() {
  const pid = useProjectId()

  const { data } = useQuery(q, {
    variables: {
      id: pid!,
    },
    skip: !pid,
  })

  if (!pid) {
    return null
  }

  return (
    <span className='text-sm ml-2 border-l border-slate-300 dark:border-slate-600 pl-2'>{data?.project.name}</span>
  )
}

export default ProjectLiteInfo
