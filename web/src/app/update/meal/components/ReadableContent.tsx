'use client'

import { Button } from '@/components/Button'
import { PencilSimpleLine, Trash } from '@/assets/icons/phosphor-react'

export function ReadableContent() {
  return (
    <section className="flex flex-1 flex-col justify-between overflow-y-auto rounded-t-[20px] bg-gray-100 px-6 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">X-tudo</h2>
          <p className="text-base">Xis completo da lancheria do bairro</p>
        </div>

        <div className="flex flex-col gap-2">
          <strong className="text-sm">Data e hora</strong>
          <p className="text-base">12/08/2022 às 20:00</p>
        </div>

        <div className="flex">
          <div className="flex items-center justify-center gap-2 rounded-full bg-gray-200 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-red-dark" />
            <span className="text-sm">fora da dieta</span>
          </div>
        </div>
      </div>

      <footer className="flex flex-col justify-center gap-2">
        <Button type="submit" className="w-full" form="register-meal">
          <PencilSimpleLine size={18} />
          Editar refeição
        </Button>
        <Button
          type="submit"
          className="w-full"
          form="register-meal"
          variant="outline"
        >
          <Trash size={18} />
          Excluir refeição
        </Button>
      </footer>
    </section>
  )
}
