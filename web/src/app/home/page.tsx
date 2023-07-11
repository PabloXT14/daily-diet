import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <div className="flex items-center gap-2 m-4">
        <Skeleton className="w-7 h-7 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-20"/>
          <Skeleton className="h-2 w-12"/>
        </div>
      </div>
    </main>
  )
}