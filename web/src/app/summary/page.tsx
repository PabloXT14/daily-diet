import { PercentSection } from './components/PercentSection'
import { ContentSection } from './components/ContentSection'

export default function Summary() {
  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-green-light">
      <PercentSection color="secondary" />
      <ContentSection />
    </main>
  )
}
