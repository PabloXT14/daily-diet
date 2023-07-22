import { ArrowUpRight } from '@/assets/icons/phosphor-react'

export function PercentSection() {
  return (
    <section className="relative mb-10 mt-9 flex h-[102px] flex-col items-center justify-center rounded-lg bg-green-light">
      <strong className="text-3xl font-bold text-gray-700">90,86%</strong>
      <span className="text-sm text-gray-600">
        das refeições dentro da dieta
      </span>
      <button className="">
        <ArrowUpRight
          className="absolute right-2 top-2 text-green-dark"
          size={24}
        />
      </button>
    </section>
  )
}
