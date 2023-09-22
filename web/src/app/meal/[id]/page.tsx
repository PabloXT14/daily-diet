import { twMerge } from 'tailwind-merge'

import { Content } from './components/Content'
import { Header } from './components/Header'

interface MealPageProps {
  params: {
    id: string
  }
}

export default function MealPage({ params }: MealPageProps) {
  const { id } = params
  const isDiet = false

  return (
    <main
      className={twMerge(
        'flex h-screen flex-col overflow-hidden',
        isDiet ? 'bg-green-light' : 'bg-red-light',
      )}
    >
      <Header />
      <Content />
    </main>
  )
}
