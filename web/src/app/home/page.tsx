import { Skeleton } from '@/components/ui/skeleton'
import { Rocket } from '@/assets/icons/phosphor-react'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Rocket size={32} />
      <div className="m-4 flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full bg-gray-400" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-20 bg-gray-400" />
          <Skeleton className="h-2 w-12 bg-gray-400" />
        </div>
      </div>
    </main>
  )
}
