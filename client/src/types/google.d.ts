/** Google Identity Services (GSI) types for Sign in with Google */
interface CredentialResponse {
  credential: string
  select_by?: string
  clientId: string
}

interface IdConfiguration {
  client_id: string
  auto_select?: boolean
  callback: (response: CredentialResponse) => void
  login_uri?: string
  native_callback?: (response: { id_token: string; access_token: string }) => void
  cancel_on_tap_outside?: boolean
  prompt_parent_id?: string
  nonce?: string
  context?: 'signin' | 'signup' | 'use'
  state_cookie_domain?: string
  ux_mode?: 'popup' | 'redirect'
  allowed_parent_origin?: string
  intermediate_iframe_close_callback?: () => void
}

interface GoogleAccounts {
  id: {
    initialize: (config: IdConfiguration) => void
    prompt: (momentListener?: (notification: { isDisplayed: () => boolean; isNotDisplayed: () => boolean; getNotDisplayedReason: () => string }) => void) => void
    renderButton: (parent: HTMLElement, options: { theme?: 'outline' | 'filled_blue' | 'filled_black'; size?: 'large' | 'medium' | 'small'; type?: 'standard' | 'icon'; width?: number }) => void
    disableAutoSelect: () => void
    storeCredential: (credential: { id: string; password: string }, callback: () => void) => void
    cancel: () => void
  }
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts }
    onGoogleLibraryLoad?: () => void
  }
}

export type { CredentialResponse, IdConfiguration }
