'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import dailyDietLogo from '@/assets/daily-diet-logo.svg'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

type LoginFormData = z.infer<typeof loginFormSchema>

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  async function handleLogin(data: LoginFormData) {
    console.log(data)
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center">
      <img
        src={dailyDietLogo.src}
        alt="Daily Diet Logo"
        className="mb-8 w-32"
      />

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="mb-2 flex w-full flex-col gap-4"
      >
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

        <Button type="submit">Entrar</Button>
      </form>

      <div>
        <Link
          href="/register/user"
          className="text-sm font-bold text-gray-600 "
        >
          Não tem uma conta?
        </Link>
      </div>
    </div>
  )
}
