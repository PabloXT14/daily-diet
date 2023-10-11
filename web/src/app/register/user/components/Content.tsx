'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import dailyDietLogo from '@/assets/daily-diet-logo.svg'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

const registerUserFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  avatar_url: z.string().url({ message: 'URL inválida' }).optional(),
})

type RegisterUserFormData = z.infer<typeof registerUserFormSchema>

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserFormSchema),
  })

  async function handleRegisterUser(data: RegisterUserFormData) {
    console.log(data)
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <img
        src={dailyDietLogo.src}
        alt="Daily Diet Logo"
        className="mb-8 w-32"
      />

      <p className="mb-8 text-center text-sm font-bold text-gray-700">
        Seu aplicativo de controle de dieta!
      </p>

      <form
        onSubmit={handleSubmit(handleRegisterUser)}
        className="mb-2 flex w-full flex-col gap-4"
      >
        <Input type="text" placeholder="Nome" {...register('name')} />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}

        <Input type="email" placeholder="Email" {...register('email')} />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}

        <Input type="password" placeholder="Senha" {...register('password')} />
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}

        <Input
          type="url"
          placeholder="URL do avatar"
          {...register('avatar_url')}
        />
        {errors.avatar_url && (
          <span className="text-xs text-red-500">
            {errors.avatar_url.message}
          </span>
        )}

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}
