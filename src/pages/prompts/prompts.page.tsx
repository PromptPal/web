import React from 'react'
import { Link } from 'react-router-dom'

type PromptsPageProps = {
}

function PromptsPage(props: PromptsPageProps) {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1>Prompts</h1>
        <Link to='/prompts/new' className='daisyui-btn daisyui-btn-primary'>
          New Prompt
        </Link>
      </div>
      <div className=' daisyui-divider' />

      <div>
        table list
      </div>

    </div>
  )
}

export default PromptsPage