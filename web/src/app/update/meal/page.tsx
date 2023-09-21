import { Header } from './components/Header'
import { ReadableContent } from './components/ReadableContent'

export default function MealUpdate() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-300">
      <Header />
      <ReadableContent />
    </main>
  )
}
