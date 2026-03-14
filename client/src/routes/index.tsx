import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return <main className="page-wrap px-4 pb-8 pt-14">hi</main>
}
