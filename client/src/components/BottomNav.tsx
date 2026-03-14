import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Plus, User } from 'lucide-react'

const navHeight = 56

export const BOTTOM_NAV_HEIGHT = navHeight

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: typeof Home
}) {
  const router = useRouterState()
  const pathname = router.location.pathname
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to))

  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[var(--sea-ink)] no-underline"
      style={{
        color: isActive ? 'var(--lagoon-deep)' : 'var(--sea-ink-soft)',
      }}
    >
      <Icon
        size={22}
        strokeWidth={isActive ? 2.25 : 1.9}
        aria-hidden
      />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}

export function BottomNav() {
  return (
    <nav
      role="navigation"
      aria-label="Main"
      className="fixed bottom-0 left-0 right-0 z-10 flex items-stretch border-t border-[var(--line)] bg-[var(--header-bg)]"
      style={{ height: navHeight }}
    >
      <NavItem to="/" label="Home" icon={Home} />
      <NavItem to="/meals/new" label="Add meal" icon={Plus} />
      <NavItem to="/profile" label="Profile" icon={User} />
    </nav>
  )
}
