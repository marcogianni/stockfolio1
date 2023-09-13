import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Stock = {
  symbol: string
  currency: string
  exchange: string
  instrumentName: string
}

export const columns: ColumnDef<Stock>[] = [
  {
    id: 'select',
    cell: ({ table, row }) => {
      return (
        <Checkbox
          disabled={table.getIsSomeRowsSelected() && !row.getIsSelected()}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'instrument_name',
    header: 'Name',
  },
  {
    accessorKey: 'exchange',
    header: 'Exchange',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
  },
]