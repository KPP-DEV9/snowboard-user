import numeral from "numeral"

export const Vat = 1.07

export const Inv = (total: number) => {
  if (total > 0) {
    return numeral(total * Vat).format("0,0.00")
  } else {
    return 0
  }
}
