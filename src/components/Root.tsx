import { Outlet } from '@tanstack/router'

function Root() {
  return (
    <div>
      <div>
        header
      </div>
      <hr />
      <Outlet />
    </div>
  )
}

export default Root