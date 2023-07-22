import { Avatar } from '@/components/Avatar'

import dailyDietLogoSVG from '@/assets/daily-diet-logo.svg'

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <img src={dailyDietLogoSVG.src} alt="logo" />
      <Avatar.Root className="h-10 w-10 border-2 border-gray-600">
        <Avatar.Image src="https://github.com/pabloxt14.png" />
        <Avatar.Fallback>PA</Avatar.Fallback>
      </Avatar.Root>
    </header>
  )
}
