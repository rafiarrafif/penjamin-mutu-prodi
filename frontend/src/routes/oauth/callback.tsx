import { createFileRoute } from '@tanstack/react-router'
import { OAuthCallbackView } from '#/components/auth/oauth-callback-view'

export const Route = createFileRoute('/oauth/callback')({
  component: OAuthCallbackView,
})
