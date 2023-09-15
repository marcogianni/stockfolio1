import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import LoginDialog from './LoginDialog'

type Props = {
  handleOpenDialog: () => void
  isLoggedIn: boolean
}

export default function Empty(props: Props) {
  return (
    <div className="h-[calc(100vh-57px)] flex justify-center items-center">
      <div className="text-center max-w-xl">
        <h2 className="scroll-m-20 text-5xl font-bold tracking-tight">Nothing too see here</h2>
        {props.isLoggedIn ? (
          <>
            <p className="text-4xl mt-2">Add your first stocks to your personal Stockfolio</p>
            <Button key="add-stocks" size="lg" className="mt-4" onClick={props.handleOpenDialog}>
              <PlusIcon className="h-4 w-4" />
              <span className="pl-2">Add Stock</span>
            </Button>
          </>
        ) : (
          <>
            <p className="text-4xl mt-2">You have to sign up</p>
          </>
        )}
      </div>
    </div>
  )
}
