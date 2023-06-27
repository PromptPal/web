import React from 'react'

type ProjectsPageProps = {
}

function ProjectsPage(props: ProjectsPageProps) {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1>Projects</h1>
        <button className='daisyui-btn daisyui-btn-primary'>
          New Project
        </button>
      </div>
      <div className=' daisyui-divider' />

      <div>
        table list
      </div>

    </div>
  )
}

export default ProjectsPage