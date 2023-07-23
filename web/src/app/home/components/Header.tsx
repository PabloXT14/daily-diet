import Image from 'next/image'
import { Avatar } from '@/components/Avatar'

import dailyDietLogoSVG from '@/assets/daily-diet-logo.svg'

export function Header() {
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
        <Avatar.Image src="https://github.com/pabloxt14.png" />
        <Avatar.Fallback>PA</Avatar.Fallback>
      </Avatar.Root>
    </header>
  )
}
