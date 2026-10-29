import { createFileRoute } from '@tanstack/react-router'
import { ApiTestPage } from '../pages/week5-api-page'

export const Route = createFileRoute('/api')({
  component: ApiTestPage,
});

