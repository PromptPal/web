import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Project } from '../../gql/graphql'

type ProjectCardItemProps = {
  project: Pick<Project, 'id' | 'name' | 'createdAt' | 'enabled'>
}

function ProjectCardItem(props: ProjectCardItemProps) {
  const { project } = props

  const createdAt = useMemo(() => {
    return new Intl.DateTimeFormat().format(new Date(project.createdAt))
  }, [project.createdAt])

  return (
    <Link
      to={`/${project.id}`}
      className="w-full py-4 rounded-lg flex justify-center items-center flex-col"
      data-glow
      style={
        {
          '--base': project.id * 300,
          '--spread': 20,
          '--outer': 1,
          '--bg-spot-opacity': 0.05,
          backdropFilter: 'blur(calc(var(--cardblur, 5) * 1px))',
        } as React.CSSProperties
      }
    >
      <h3 className="text-2xl font-bold text-black dark:text-white">
        #{project.id} {project.name}
      </h3>
      <p className="text-sm text-slate-700 mt-4 dark:text-slate-200">
        {createdAt}
      </p>
    </Link>
  )
}

export default ProjectCardItem
