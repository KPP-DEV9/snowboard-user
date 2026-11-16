import Logo from "@/components/Logo"
import { Phone, Mail } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"
import LayoutPage from "@/components/Layout"

export const dynamic = "force-dynamic"

interface Contact {
  id: string
  type: string // "contact" | "personal" | "social"
  name: string // "phone" | "line" | "email" | "facebook" | "instagram" | "tiktok"
  value: string
  is_active?: boolean
  isActive?: boolean
}

export default async function ContactPage() {
  const res: any = await api.contacts.getAll()
  const rawContacts =
    res?.contacts || res?.data?.contacts || res?.data || (Array.isArray(res) ? res : [])

  const allContacts: Contact[] = Array.isArray(rawContacts) ? rawContacts : []

  // Filter active contacts
  const activeContacts = allContacts.filter(
    (c) =>
      c &&
      c.is_active !== false &&
      c.isActive !== false &&
      typeof c.value === "string" &&
      c.value.trim() !== "",
  )

  const contactList = activeContacts.filter(
    (c) =>
      c.type?.toLowerCase() === "contact" ||
      c.type?.toLowerCase() === "personal" ||
      ["phone", "tel", "line", "email"].includes(c.name?.toLowerCase()),
  )

  const socialList = activeContacts.filter(
    (c) =>
      c.type?.toLowerCase() === "social" ||
      ["facebook", "instagram", "tiktok"].includes(c.name?.toLowerCase()),
  )

  return (
    <LayoutPage isLicense={false}>
      <div className="min-h-screen pb-32 font-sans selection:bg-[#568759]/30 flex flex-col items-center">
        {/* Header Logo */}
        <div className="pt-12 md:pt-16 pb-8 flex flex-col items-center justify-center w-full relative max-w-md px-4">
          <div className="hover:scale-105 transition-transform">
            <Logo className="!w-[130px] md:!w-[150px]" />
          </div>
        </div>

        {/* Contact Card */}
        <div className="w-full max-w-md px-4">
          <div className="bg-[#0A1A28]/40 backdrop-blur-md border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-white text-2xl font-extrabold mb-1 tracking-tight">ติดต่อเจ้าหน้าที่</h2>
            <p className="text-white/70 text-sm mb-6">ช่องทางติดต่อสอบถาม</p>

            <div className="space-y-1">
              {contactList.map((contact) => {
                const contactName = contact.name?.toLowerCase()

                if (contactName === "phone" || contactName === "tel") {
                  return (
                    <a
                      key={contact.id}
                      href={`tel:${contact.value.replace(/[^0-9+]/g, "")}`}
                      className="flex items-center gap-4 py-3.5 border-b border-white/10 hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                        <Phone size={20} className="text-[#86EFAC]" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-[16px] mb-0.5">
                          {contact.value}
                        </div>
                        <div className="text-white/60 text-xs">เบอร์โทรศัพท์สำนักงาน</div>
                      </div>
                    </a>
                  )
                }

                if (contactName === "line") {
                  return (
                    <a
                      key={contact.id}
                      href={
                        contact.value.startsWith("http") || contact.value.startsWith("line://")
                          ? contact.value
                          : `https://line.me/R/ti/p/${contact.value.startsWith("@") ? contact.value : "~" + contact.value}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 py-3.5 border-b border-white/10 hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                        <Image src="/logo/line.png" alt="Line" width={26} height={26} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-[16px] mb-0.5">
                          {contact.value}
                        </div>
                        <div className="text-white/60 text-xs">Line Official</div>
                      </div>
                    </a>
                  )
                }

                if (contactName === "email") {
                  return (
                    <a
                      key={contact.id}
                      href={`mailto:${contact.value}`}
                      className="flex items-center gap-4 py-3.5 border-b border-white/10 hover:bg-white/5 transition-colors rounded-xl px-2 -mx-2"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                        <Mail size={20} className="text-[#E86034]" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-[16px] mb-0.5">
                          {contact.value}
                        </div>
                        <div className="text-white/60 text-xs">อีเมล์</div>
                      </div>
                    </a>
                  )
                }

                return null
              })}
            </div>

            {/* Social */}
            {socialList.length > 0 && (
              <div className="mt-8 mb-6">
                <h3 className="font-bold text-white text-base mb-4">Social</h3>
                <div className="flex items-center gap-3">
                  {socialList.map((link) => {
                    const socialName = link.name?.toLowerCase()
                    const linkUrl = link.value.startsWith("http")
                      ? link.value
                      : `https://${link.value}`

                    if (socialName === "facebook") {
                      return (
                        <a
                          key={link.id}
                          href={linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105"
                          aria-label="Facebook"
                        >
                          <svg viewBox="0 0 24 24" fill="#3B82F6" className="w-6 h-6">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )
                    }

                    if (socialName === "instagram") {
                      return (
                        <a
                          key={link.id}
                          href={linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105"
                          aria-label="Instagram"
                        >
                          <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <defs>
                              <linearGradient
                                id={`ig-grad-${link.id}`}
                                x1="0%"
                                y1="100%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop offset="0%" stopColor="#f09433" />
                                <stop offset="25%" stopColor="#e6683c" />
                                <stop offset="50%" stopColor="#dc2743" />
                                <stop offset="75%" stopColor="#cc2366" />
                                <stop offset="100%" stopColor="#bc1888" />
                              </linearGradient>
                            </defs>
                            <rect
                              width="24"
                              height="24"
                              rx="6"
                              fill={`url(#ig-grad-${link.id})`}
                            />
                            <path
                              fill="#fff"
                              d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 9.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3.5-5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z"
                            />
                            <circle fill="#fff" cx="12" cy="12" r="2" />
                          </svg>
                        </a>
                      )
                    }

                    if (socialName === "tiktok") {
                      return (
                        <a
                          key={link.id}
                          href={linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105"
                          aria-label="TikTok"
                        >
                          <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <rect width="24" height="24" rx="6" fill="#000" />
                            <path
                              fill="#fff"
                              d="M12.53 4.5h2.51c.21 1.48 1.14 2.65 2.5 3.09v2.66c-1.03-.02-1.97-.33-2.77-.85v4.54c0 3.07-2.56 5.56-5.71 5.56S3.35 17.01 3.35 13.94c0-3.07 2.56-5.56 5.71-5.56h.05v2.85h-.05c-1.52 0-2.75 1.22-2.75 2.71s1.23 2.71 2.75 2.71 2.75-1.22 2.75-2.71V4.5z"
                            />
                          </svg>
                        </a>
                      )
                    }

                    return null
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-white/10 text-center text-[11px] text-white/40 font-medium">
              Snowvibes Co., Ltd. • Snowwhite by Snowvibes
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  )
}
