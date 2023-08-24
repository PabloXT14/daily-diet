import { Content } from './components/Content'
import { Header } from './components/Header'

export default function MealRegister() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-300">
      <Header />
      <Content />
    </main>
  )
}
