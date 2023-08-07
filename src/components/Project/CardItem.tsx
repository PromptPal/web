import React from 'react'
import { Project } from '../../gql/graphql'
import { Link } from 'react-router-dom'

type ProjectCardItemProps = {
  project: Pick<Project, 'id' | 'name' | 'createdAt' | 'enabled'>
}

function ProjectCardItem(props: ProjectCardItemProps) {
  const { project } = props
  return (
    <Link
      to={`/projects/${project.id}`}
      className='w-full py-4 rounded bg-gradient-to-br from-teal-400 to-pink-400 via-purple-400 flex justify-center items-center flex-col hover:scale-105 focus:scale-95 cursor-pointer duration-75'
    >
      <h3 className='text-2xl font-bold text-black'>#{project.id} {project.name}</h3>
      <p className='text-sm text-slate-700 mt-4'>{project.createdAt}</p>
    </Link>
  )
}

export default ProjectCardItem