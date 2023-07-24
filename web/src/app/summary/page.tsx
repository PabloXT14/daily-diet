import { PercentSection } from './components/PercentSection'
import { ContentSection } from './components/ContentSection'

export default function Summary() {
  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-green-light pt-9">
      <PercentSection />
      <ContentSection />
    </main>
  )
}
