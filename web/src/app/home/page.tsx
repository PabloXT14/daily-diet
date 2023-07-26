import { PercentSection } from './components/PercentSection'
import { MealsSection } from './components/MealsSection'
import { Header } from './components/Header'
import { Gradient } from './components/Gradient'

export default function Home() {
  return (
    <main className="relative flex h-screen flex-col overflow-hidden px-6 pt-9">
      <Header />

      <PercentSection color="secondary" />

      <MealsSection />

      <Gradient />
    </main>
  )
}