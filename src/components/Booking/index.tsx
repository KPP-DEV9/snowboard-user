interface Props {
  userId: string
}

export default async function Booking({ userId }: Props) {
  if (!userId) return null

  // return <BookingList summary={summary} />
}
