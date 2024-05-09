import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import { usePointerUpdate } from '../../hooks/glow'
import Header from '../Header/Header'

function BaseLayout() {
  usePointerUpdate()
  return (
    <div
      className="container mx-auto flex flex-col h-full min-h-screen"
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
