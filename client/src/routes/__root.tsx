import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { BottomNav, BOTTOM_NAV_HEIGHT } from '#/components/BottomNav'
import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

const APP_NAV_PATHS = ['/', '/meals/new', '/profile']

function RootComponent() {
  const { pathname } = useLocation()
  const showBottomNav = APP_NAV_PATHS.includes(pathname)

  return (
    <>
      <div
        className="min-h-full"
        style={
          showBottomNav
            ? { paddingBottom: BOTTOM_NAV_HEIGHT }
            : undefined
        }
      >
        <Outlet />
      </div>
      {showBottomNav && <BottomNav />}
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
