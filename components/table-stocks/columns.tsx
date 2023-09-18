import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { UserStock } from '@/lib/types'

export const columns: ColumnDef<UserStock>[] = [
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

export function columnsRender(editingStock: UserStock | null): ColumnDef<UserStock>[] {
  if (!editingStock) {
    return [
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
  }

  return [
    {
      id: 'select',
      cell: ({ table, row }) => {
        return <Checkbox disabled checked onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
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
}
