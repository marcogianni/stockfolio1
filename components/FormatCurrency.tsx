'use client'

import usePreferredLanguage from '@/hooks/usePreferredLanguage'

type Props = {
  value: number
  currency?: string | undefined
}

export default function FormatCurrency(props: Props) {
  const language = usePreferredLanguage()
  const { value, currency = 'USD' } = props

  const formatConfig = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol',
  }

  const formattedValue = new Intl.NumberFormat(language, formatConfig).format(value)

  return formattedValue
}
