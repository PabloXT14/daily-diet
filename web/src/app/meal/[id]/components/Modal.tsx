'use-client'

import { useParams } from 'next/navigation'

import { Button } from '@/components/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Trash } from '@/assets/icons/phosphor-react'

export const Modal = () => {
  const params = useParams()

  console.log(params?.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="w-full"
          form="register-meal"
          variant="outline"
        >
          <Trash size={18} />
          Excluir refeição
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-[calc(100%-2rem)] max-w-[327px] flex-col gap-0 rounded-lg bg-gray-100 pt-10">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-center text-xl font-bold">
            Deseja realmente excluir o registro da refeição?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex w-full flex-row flex-wrap gap-3 min-[320px]:flex-nowrap">
          <DialogClose asChild className="w-full">
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="w-full">Sim, excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
