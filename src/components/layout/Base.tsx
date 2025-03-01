import { Outlet } from '@tanstack/react-router'
import React from 'react'
import { Toaster } from 'react-hot-toast'
// import { usePointerUpdate } from '../../hooks/glow'
import Header from '../Header/Header.modern'

function BaseLayout() {
  // usePointerUpdate()
  return (
    <div className='min-h-screen bg-gray-900'>
      <Header />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Outlet />
      </main>
      <Toaster />
      <div data-st-role='modal' />
    </div>
  )
  return (
    <div
      className='container mx-auto flex flex-col h-full min-h-screen'
      style={
        {
          '--menu-width': '150px',
          '--body-width': 'calc(100% - var(--menu-width))',
        } as React.CSSProperties
      }
    >
      <Header />
      <Outlet />
      <Toaster />
    </div>
  )
}

export default BaseLayout
