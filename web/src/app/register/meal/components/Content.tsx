'use client'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { TextArea } from '@/components/TextArea'
import { RadioGroup } from '@/components/RadioGroup'

export function Content() {
  const router = useRouter()

  async function handleRegisterMeal(event: FormEvent) {
    event.preventDefault()

    await router.push(`/register/meal/feedback?is-diet=${true}`)
  }

  return (
    <section className="flex-1 overflow-y-auto rounded-t-[20px] bg-gray-100 px-6 py-10">
      <form className="space-y-6" id="register-meal">
        <Input label="Nome" />

        <TextArea
          label="Descrição"
          className="flex h-[120px] resize-none items-start justify-start"
        />

        <div className="flex w-full gap-5">
          <Input label="Data" className="w-full flex-1" type="date" />
          <Input label="Hora" className="w-full flex-1" type="time" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-600">
            Está dentro da dieta?
          </label>
          <RadioGroup.Root>
            <div className="flex w-full gap-2">
              <RadioGroup.Item value="true" id="option-1" className="w-full">
                Sim
              </RadioGroup.Item>
              <RadioGroup.Item
                value="false"
                id="option-2"
                variant="secondary"
                className="w-full"
              >
                Não
              </RadioGroup.Item>
            </div>
          </RadioGroup.Root>
        </div>
      </form>

      <Button
        type="submit"
        className="mt-10 w-full"
        form="register-meal"
        onClick={handleRegisterMeal}
      >
        Cadastrar refeição
      </Button>
    </section>
  )
}
