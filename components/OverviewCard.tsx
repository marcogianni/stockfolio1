import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

export default function OverviewCard(props: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props?.title}</CardTitle>
        <CardDescription>{props?.description}</CardDescription>
      </CardHeader>
      <CardContent>{props?.children}</CardContent>
    </Card>
  )
}
