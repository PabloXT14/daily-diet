'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import ImgIsDietTrue from '@/assets/img-is-diet-true.png'
import ImgIsDietFalse from '@/assets/img-is-diet-false.png'
import { Button } from '@/components/Button'

export const FeedbackContent = () => {
  const params = useSearchParams()

  const isDiet = params.get('is-diet') === 'true'

  return (
    <>
      {isDiet ? (
        <section className="flex h-full flex-col items-center justify-center gap-10">
          <header className="text-center">
            <h1 className="text-2xl font-bold text-green-dark">
              Continue assim!
            </h1>
            <p className="text-base text-gray-700">
              Você continua <strong>dentro da dieta</strong>. Muito bem!
            </p>
          </header>
          <img
            src={ImgIsDietTrue.src}
            alt=""
            className="w-full max-w-[224px]"
          />
          <Link href="/home">
            <Button>Ir para a página inicial</Button>
          </Link>
        </section>
      ) : (
        <section className="flex h-full flex-col items-center justify-center gap-10">
          <header className="text-center">
            <h1 className="text-2xl font-bold text-red-dark">Que pena!</h1>
            <p className="text-base text-gray-700">
              Você <strong>saiu da dieta</strong> dessa vez, mas continue se
              esforçando e não desista!
            </p>
          </header>
          <img src={ImgIsDietFalse.src} alt="" className="max-w-[224px]" />
          <Link href="/home">
            <Button>Ir para a página inicial</Button>
          </Link>
        </section>
      )}
    </>
  )
}
