import React from 'react'

/**
 * Component displayed when no preview data is available
 */
const NoPreviewAvailable = () => (
  <div className='p-8 rounded-lg bg-linear-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl'>
    <h2 className='text-xl font-bold text-gray-200'>No Preview Available</h2>
    <p className='text-gray-400 mt-2'>
      Test your prompt to see the results here
    </p>
  </div>
)

export default NoPreviewAvailable
