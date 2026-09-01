export interface NationalityOption {
  value: string
  label: string
  aliases: string[]
}

export const NATIONALITIES: NationalityOption[] = [
  { value: "ไทย (Thai)", label: "ไทย (Thai)", aliases: ["thai", "ไทย", "thailand", "th"] },
  { value: "อเมริกัน (American)", label: "อเมริกัน (American)", aliases: ["american", "usa", "us", "united states"] },
  { value: "อังกฤษ (British)", label: "อังกฤษ (British)", aliases: ["british", "uk", "english", "united kingdom"] },
  { value: "ญี่ปุ่น (Japanese)", label: "ญี่ปุ่น (Japanese)", aliases: ["japanese", "japan", "jp"] },
  { value: "จีน (Chinese)", label: "จีน (Chinese)", aliases: ["chinese", "china", "cn"] },
  { value: "เกาหลี (Korean)", label: "เกาหลี (Korean)", aliases: ["korean", "korea", "kr"] },
  { value: "สิงคโปร์ (Singaporean)", label: "สิงคโปร์ (Singaporean)", aliases: ["singaporean", "singapore", "sg"] },
  { value: "มาเลเซีย (Malaysian)", label: "มาเลเซีย (Malaysian)", aliases: ["malaysian", "malaysia", "my"] },
  { value: "เวียดนาม (Vietnamese)", label: "เวียดนาม (Vietnamese)", aliases: ["vietnamese", "vietnam", "vn"] },
  { value: "ลาว (Lao)", label: "ลาว (Lao)", aliases: ["lao", "laos", "la"] },
  { value: "พม่า (Burmese)", label: "พม่า (Burmese)", aliases: ["burmese", "myanmar", "mm"] },
  { value: "อินโดนีเซีย (Indonesian)", label: "อินโดนีเซีย (Indonesian)", aliases: ["indonesian", "indonesia", "id"] },
  { value: "ฟิลิปปินส์ (Filipino)", label: "ฟิลิปปินส์ (Filipino)", aliases: ["filipino", "philippines", "ph"] },
  { value: "อินเดีย (Indian)", label: "อินเดีย (Indian)", aliases: ["indian", "india", "in"] },
  { value: "ออสเตรเลีย (Australian)", label: "ออสเตรเลีย (Australian)", aliases: ["australian", "australia", "au"] },
  { value: "เยอรมัน (German)", label: "เยอรมัน (German)", aliases: ["german", "germany", "de"] },
  { value: "ฝรั่งเศส (French)", label: "ฝรั่งเศส (French)", aliases: ["french", "france", "fr"] },
  { value: "รัสเซีย (Russian)", label: "รัสเซีย (Russian)", aliases: ["russian", "russia", "ru"] },
]

export function normalizeNationality(val?: string | null): string {
  if (!val) return ""
  const match = NATIONALITIES.find(
    (n) =>
      n.value.toLowerCase() === val.toLowerCase() ||
      n.aliases.some((alias) => alias.toLowerCase() === val.toLowerCase()),
  )
  return match ? match.value : val
}
