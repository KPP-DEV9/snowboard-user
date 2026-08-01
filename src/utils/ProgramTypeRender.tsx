interface Props {
  type: string
  hours: number
  times: number
  days: number
}

export const ProgramTypeRenderValue = ({ type, hours, times, days }: Props) => {
  switch (type.toUpperCase()) {
    case "PRIVATE_COACHING":
    case "WORKSHOP":
    case "SIMULATOR":
      return {
        value: hours,
        text: `${hours} ชั่วโมง`,
      }
    case "SHORT_GAME":
    case "TOURNAMENT":
      return {
        value: times,
        text: `${times} ครั้ง`,
      }
    case "CAMP":
      return {
        value: days,
        text: `${days} วัน`,
      }
    default:
      return {
        value: "",
        text: "-",
      }
  }
}
