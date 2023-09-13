import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

export default function Empty() {
  return (
    <div className="h-[calc(100vh-57px)] flex justify-center items-center">
      <div className="text-center max-w-xl">
        <h2 className="scroll-m-20 text-5xl font-bold tracking-tight">Nothing too see here</h2>
        <p className="text-4xl mt-2">Add your first stocks to your personal Stockfolio</p>
        <Button size="lg" className="mt-4">
          <PlusIcon className="h-4 w-4" />
          <span className="pl-2">Add Stock</span>
        </Button>
      </div>
    </div>
  )
}
