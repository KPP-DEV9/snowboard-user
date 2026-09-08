export const HAT_SIZE_OPTIONS = ["S", "M", "L", "XL"]
export const GLOVE_SIZE_OPTIONS = ["S", "M", "L", "XL"]
export const SHOE_SIZE_OPTIONS = Array.from(
  { length: (50 - 4) / 0.5 + 1 },
  (_, i) => (4 + i * 0.5).toString()
)
