import { Card } from "../Ui/Card/Card"

interface Props {
  summary: []
}

export default function BookingListAll({ summary }: Props) {
  return (
    <Card interactive className="overflow-hidden p-0">
      <div className="flex flex-col p-1 gap-2"></div>
    </Card>
  )
}
