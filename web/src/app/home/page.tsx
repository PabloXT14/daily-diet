import { Button } from '@/components/Button'
import { Trash } from '@/assets/icons/phosphor-react'
import { Toggle } from '@/components/Toggle'
import { Input } from '@/components/Input'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  pt-20">
      <h1>Testing Default Components</h1>

      <div className="mt-3 space-y-2">
        <Button variant="default">
          <Trash size={18} />
          Label
        </Button>

        <Button variant="outline">
          <Trash size={18} />
          Label
        </Button>

        <Toggle className="w-full">Sim</Toggle>

        <Toggle variant="secondary" className="w-full">
          Não
        </Toggle>

        <Input type="text" label="Label" className="w-60" />
      </div>
    </main>
  )
}
