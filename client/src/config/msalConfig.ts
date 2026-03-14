import type { Configuration } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID as string | undefined
// Where Microsoft redirects after login; must match Azure AD app registration (add http://localhost:3000/login in Azure)
const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/login' : 'http://localhost:3000/login'

// MSAL requires a non-empty clientId; use a placeholder when not configured so provider can mount
const safeClientId = clientId && clientId.trim() ? clientId : '00000000-0000-0000-0000-000000000000'

export const msalConfig: Configuration = {
  auth: {
    clientId: safeClientId,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
}

export const isMsalConfigured = Boolean(clientId)
