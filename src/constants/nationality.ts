export interface NationalityOption {
  code: string
  codeAlpha3: string
  numericCode: string
  countryEn: string
  countryTh: string
  nationalityEn: string
  nationalityTh: string
}

export const NATIONALITIES: NationalityOption[] = [
  {
    code: "TH",
    codeAlpha3: "THA",
    numericCode: "764",
    countryEn: "Thailand",
    countryTh: "ไทย",
    nationalityEn: "Thai",
    nationalityTh: "ไทย",
  },
  {
    code: "US",
    codeAlpha3: "USA",
    numericCode: "840",
    countryEn: "United States",
    countryTh: "สหรัฐอเมริกา",
    nationalityEn: "American",
    nationalityTh: "อเมริกัน",
  },
  {
    code: "GB",
    codeAlpha3: "GBR",
    numericCode: "826",
    countryEn: "United Kingdom",
    countryTh: "สหราชอาณาจักร",
    nationalityEn: "British",
    nationalityTh: "อังกฤษ",
  },
  {
    code: "JP",
    codeAlpha3: "JPN",
    numericCode: "392",
    countryEn: "Japan",
    countryTh: "ญี่ปุ่น",
    nationalityEn: "Japanese",
    nationalityTh: "ญี่ปุ่น",
  },
  {
    code: "CN",
    codeAlpha3: "CHN",
    numericCode: "156",
    countryEn: "China",
    countryTh: "จีน",
    nationalityEn: "Chinese",
    nationalityTh: "จีน",
  },
  {
    code: "KR",
    codeAlpha3: "KOR",
    numericCode: "410",
    countryEn: "South Korea",
    countryTh: "เกาหลีใต้",
    nationalityEn: "Korean",
    nationalityTh: "เกาหลี",
  },
  {
    code: "SG",
    codeAlpha3: "SGP",
    numericCode: "702",
    countryEn: "Singapore",
    countryTh: "สิงคโปร์",
    nationalityEn: "Singaporean",
    nationalityTh: "สิงคโปร์",
  },
  {
    code: "MY",
    codeAlpha3: "MYS",
    numericCode: "458",
    countryEn: "Malaysia",
    countryTh: "มาเลเซีย",
    nationalityEn: "Malaysian",
    nationalityTh: "มาเลเซีย",
  },
  {
    code: "VN",
    codeAlpha3: "VNM",
    numericCode: "704",
    countryEn: "Vietnam",
    countryTh: "เวียดนาม",
    nationalityEn: "Vietnamese",
    nationalityTh: "เวียดนาม",
  },
  {
    code: "LA",
    codeAlpha3: "LAO",
    numericCode: "418",
    countryEn: "Laos",
    countryTh: "ลาว",
    nationalityEn: "Lao",
    nationalityTh: "ลาว",
  },
  {
    code: "MM",
    codeAlpha3: "MMR",
    numericCode: "104",
    countryEn: "Myanmar",
    countryTh: "เมียนมา",
    nationalityEn: "Burmese",
    nationalityTh: "พม่า",
  },
  {
    code: "ID",
    codeAlpha3: "IDN",
    numericCode: "360",
    countryEn: "Indonesia",
    countryTh: "อินโดนีเซีย",
    nationalityEn: "Indonesian",
    nationalityTh: "อินโดนีเซีย",
  },
  {
    code: "PH",
    codeAlpha3: "PHL",
    numericCode: "608",
    countryEn: "Philippines",
    countryTh: "ฟิลิปปินส์",
    nationalityEn: "Filipino",
    nationalityTh: "ฟิลิปปินส์",
  },
  {
    code: "IN",
    codeAlpha3: "IND",
    numericCode: "356",
    countryEn: "India",
    countryTh: "อินเดีย",
    nationalityEn: "Indian",
    nationalityTh: "อินเดีย",
  },
  {
    code: "AU",
    codeAlpha3: "AUS",
    numericCode: "036",
    countryEn: "Australia",
    countryTh: "ออสเตรเลีย",
    nationalityEn: "Australian",
    nationalityTh: "ออสเตรเลีย",
  },
  {
    code: "DE",
    codeAlpha3: "DEU",
    numericCode: "276",
    countryEn: "Germany",
    countryTh: "เยอรมนี",
    nationalityEn: "German",
    nationalityTh: "เยอรมัน",
  },
  {
    code: "FR",
    codeAlpha3: "FRA",
    numericCode: "250",
    countryEn: "France",
    countryTh: "ฝรั่งเศส",
    nationalityEn: "French",
    nationalityTh: "ฝรั่งเศส",
  },
  {
    code: "RU",
    codeAlpha3: "RUS",
    numericCode: "643",
    countryEn: "Russia",
    countryTh: "รัสเซีย",
    nationalityEn: "Russian",
    nationalityTh: "รัสเซีย",
  },
]

export function normalizeNationality(val?: string | null): string {
  if (!val) return ""
  const match = NATIONALITIES.find(
    (n) =>
      n.nationalityEn.toLowerCase() === val.toLowerCase() ||
      n.nationalityTh.toLowerCase() === val.toLowerCase(),
  )
  return match ? match.nationalityEn : val
}
