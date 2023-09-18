'use client'

type Props = {
  value: number | string
}

export default function FormatPercentage(props: Props) {
  const { value } = props

  const formatConfig = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }

  const formattedValue = new Intl.NumberFormat('default', formatConfig).format(Number(value) / 100)

  return formattedValue
}
