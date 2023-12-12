'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { TextArea } from '@/components/TextArea'
import { RadioGroup } from '@/components/RadioGroup'
import { api } from '@/lib/api'
import { SpinnerGap } from '@/assets/icons/phosphor-react'

const registerMealFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' }),
  date: z.string().min(1, { message: 'Data é obrigatória' }),
  time: z.string().min(1, { message: 'Hora é obrigatória' }),
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

export function Content() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterMealFormDataInput, any, RegisterMealFormDataOutput>({
    resolver: zodResolver(registerMealFormSchema),
  })

  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync: createMeal, isLoading } = useMutation({
    mutationFn: async (data: RegisterMealFormDataOutput) => {
      const [hours, minutes] = data && data.time.split(':')

      const mealDatetime = format(
        parseISO(data.date).setHours(Number(hours), Number(minutes)),
        "yyyy-MM-dd'T'HH:mm:ss",
      )

      await api.post(
        '/meals',
        {
          name: data.name,
          description: data.description,
          meal_datetime: mealDatetime,
          is_diet: data.isDiet,
        },
        { withCredentials: true },
      )

      return data
    },
    onSuccess: async (data: RegisterMealFormDataOutput) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })

      router.push(`/register/meal/feedback?is-diet=${data.isDiet}`)
    },
    onError: () => {
      alert('Ocorreu um erro ao cadastrar a refeição. Tente novamente.')
    },
  })

  async function handleRegisterMeal(data: RegisterMealFormDataOutput) {
    createMeal(data)
  }

  return (
    <section className="flex-1 overflow-y-auto rounded-t-[20px] bg-gray-100 px-6 py-10">
      <form
        className="space-y-6"
        id="register-meal"
        onSubmit={handleSubmit(handleRegisterMeal)}
      >
        <Input label="Nome" {...register('name')} />

        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}

        <TextArea
          label="Descrição"
          className="flex h-[120px] resize-none items-start justify-start"
          {...register('description')}
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
            render={({ field }) => (
              <RadioGroup.Root
                onValueChange={field.onChange}
                defaultValue={field.value}
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

      <Button
        type="submit"
        className="mt-10 w-full"
        form="register-meal"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <SpinnerGap size={20} className="animate-spin" />
            Carregando...
          </>
        ) : (
          'Cadastrar refeição'
        )}
      </Button>
    </section>
  )
}
