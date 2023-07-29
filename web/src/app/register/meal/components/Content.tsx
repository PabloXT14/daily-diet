import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Toggle } from '@/components/Toggle'

export function Content() {
  return (
    <section className="flex-1 overflow-y-auto rounded-t-[20px] bg-gray-100 px-6 py-10">
      <form className="space-y-6">
        <Input label="Nome" />

        <Input
          label="Descrição"
          className="flex h-[120px] items-start justify-start"
        />

        <div className="flex w-full gap-5">
          <Input label="Data" className="w-full flex-1" />
          <Input label="Hora" className="w-full flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-gray-600">
            Está dentro da dieta?
          </span>
          <div className="flex w-full gap-2">
            <Toggle className="w-full flex-1">Sim</Toggle>
            <Toggle variant="secondary" className="w-full flex-1">
              Não
            </Toggle>
          </div>
        </div>

        <Button type="submit" className="mt-auto w-full">
          Cadastrar refeição
        </Button>
      </form>
    </section>
  )
}
