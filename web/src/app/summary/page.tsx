import { PercentSection } from './components/PercentSection'
import { ContentSection } from './components/ContentSection'

export default function Summary() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gray-700">
      <PercentSection className="pb-16" />
      <ContentSection className="-mt-8" />
    </main>
  )
}
