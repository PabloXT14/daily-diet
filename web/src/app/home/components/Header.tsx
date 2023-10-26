'use client'

import Image from 'next/image'
import { Avatar } from '@/components/Avatar'

import dailyDietLogoSVG from '@/assets/daily-diet-logo.svg'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { User } from '@/@types/user'

export function Header() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/users', { withCredentials: true })

      const user = response.data.user as User

      return user
    },
  })

  return (
    <header className="flex items-center justify-between">
      <Image
        src={dailyDietLogoSVG.src}
        alt="logo"
        quality={100}
        width={100}
        height={100}
        className="h-auto w-auto"
      />
      <Avatar.Root className="h-10 w-10 cursor-pointer border-2 border-gray-600">
        <Avatar.Image src={user?.avatar_url} />
        <Avatar.Fallback>
          {user?.name.slice(0, 2).toUpperCase()}
        </Avatar.Fallback>
      </Avatar.Root>
    </header>
  )
}
