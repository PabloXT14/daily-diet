import { Content } from './components/Content'
import { Header } from './components/Header'

interface MealUpdatePageProps {
  params: {
    id: string
  }
}

export default function MealUpdatePage({ params }: MealUpdatePageProps) {
  const { id } = params

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-300">
      <Header />
      <Content />
    </main>
  )
}
