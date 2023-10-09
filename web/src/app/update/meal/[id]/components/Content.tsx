'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { TextArea } from '@/components/TextArea'
import { RadioGroup } from '@/components/RadioGroup'

const registerMealFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' }),
  date: z.string().nonempty({ message: 'Data é obrigatória' }),
  time: z.string().nonempty({ message: 'Hora é obrigatória' }),
  isDiet: z
    .enum(['true', 'false'], {
      required_error: 'Escolha uma opção',
    })
    .transform((isDiet) => {
      return isDiet === 'true'
    }),
})

type RegisterMealFormDataInput = z.input<typeof registerMealFormSchema>
type RegisterMealFormDataOutput = z.output<typeof registerMealFormSchema>

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterMealFormDataInput, any, RegisterMealFormDataOutput>({
    resolver: zodResolver(registerMealFormSchema),
  })
  const router = useRouter()

  async function handleUpdateMeal(data: RegisterMealFormDataOutput) {
    const { name, description, date, time, isDiet } = data

    // TODO: Update the meal in the database

    await router.push(`/meal/${'meal-id'}`)
  }

  return (
    <section className="flex-1 rounded-t-[20px] bg-gray-100 px-6 py-10">
      <form
        className="space-y-6"
        id="register-meal"
        onSubmit={handleSubmit(handleUpdateMeal)}
      >
        <Input label="Nome" {...register('name')} defaultValue={'Sanduiche'} />

        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}

        <TextArea
          label="Descrição"
          className="flex h-[120px] resize-none items-start justify-start"
          {...register('description')}
          defaultValue={'Sanduiche de frango com molho de tomate'}
        />
        {errors.description && (
          <span className="text-xs text-red-500">
            {errors.description.message}
          </span>
        )}

        <div className="flex w-full gap-5">
          <div className="flex-1">
            <Input
              label="Data"
              className="w-full"
              type="date"
              {...register('date')}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <span className="text-xs text-red-500">
                {errors.date.message}
              </span>
            )}
          </div>

          <div className="flex-1">
            <Input
              label="Hora"
              className="w-full flex-1"
              type="time"
              {...register('time')}
              defaultValue={'08:00'}
            />
            {errors.time && (
              <span className="text-xs text-red-500">
                {errors.time.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-600">
            Está dentro da dieta?
          </label>
          <Controller
            control={control}
            name="isDiet"
            render={({ field: { value = 'true', onChange } }) => (
              <RadioGroup.Root
                onValueChange={onChange}
                defaultValue={value}
                className="flex items-center gap-2"
              >
                <RadioGroup.Item className="w-full" value="true">
                  Sim
                </RadioGroup.Item>

                <RadioGroup.Item
                  variant="secondary"
                  className="w-full"
                  value="false"
                >
                  Não
                </RadioGroup.Item>
              </RadioGroup.Root>
            )}
          />
          {errors.isDiet && (
            <span className="text-xs text-red-500">
              {errors.isDiet.message}
            </span>
          )}
        </div>
      </form>

      <Button type="submit" className="mt-10 w-full" form="register-meal">
        Salvar alterações
      </Button>
    </section>
  )
}
