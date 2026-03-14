import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './contexts/AuthContext'
import { msalConfig } from './config/msalConfig'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: { auth: { isAuthenticated: false } },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

async function init() {
  const msalInstance = new PublicClientApplication(msalConfig)
  await msalInstance.initialize()
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    )
  }
}

init()
