'use client'

import { ReactNode, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient as queryClientConfig } from '@/lib/react-query'

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => queryClientConfig)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
