import Logo from "@/components/Logo"
import { Phone, Mail } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"

export const dynamic = "force-dynamic"

interface Contact {
  id: string
  type: string // "contact" | "social"
  name: string // "phone" | "line" | "email" | "facebook" | "instagram" | "tiktok"
  value: string
}

export default async function ContactPage() {
  const res: any = await api.contacts.getAll()
  const allContacts: Contact[] = res?.contacts || []

  const contactList = allContacts.filter((c) => c.type === "contact")
  const socialList = allContacts.filter((c) => c.type === "social")

  return (
    <div className="min-h-screen bg-[#859877] pb-32 font-sans selection:bg-[#568759]/30 flex flex-col items-center">
      {/* Header Logo */}
      <div className="pt-16 pb-8 flex justify-center w-full">
        <Logo />
      </div>

      {/* Contact Card */}
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl">
          <h2 className="text-[#357948] text-2xl font-bold mb-1">ติดต่อเจ้าหน้าที่</h2>
          <p className="text-gray-500 text-sm mb-6">ช่องทางติดต่อสอบถาม</p>

          <div className="space-y-0">
            {contactList.map((contact) => {
              if (contact.name === "phone") {
                return (
                  <a
                    key={contact.id}
                    href={`tel:${contact.value.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#EAF3EA] flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-[#357948] fill-[#357948]" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[17px] mb-0.5">
                        {contact.value}
                      </div>
                      <div className="text-gray-400 text-[13px]">เบอร์โทรศัพท์สำนักงาน</div>
                    </div>
                  </a>
                )
              }
              if (contact.name === "line") {
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
                    className="flex items-center gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                      <Image src="/logo/line.png" alt="Line" width={120} height={120} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[17px] mb-0.5">
                        {contact.value}
                      </div>
                      <div className="text-gray-400 text-[13px]">Line Official</div>
                    </div>
                  </a>
                )
              }
              if (contact.name === "email") {
                return (
                  <a
                    key={contact.id}
                    href={`mailto:${contact.value}`}
                    className="flex items-center gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#EAF3EA] flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-[#357948]" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-[17px] mb-0.5">
                        {contact.value}
                      </div>
                      <div className="text-gray-400 text-[13px]">อีเมล์</div>
                    </div>
                  </a>
                )
              }
              return null
            })}
          </div>

          {/* Social */}
          {socialList.length > 0 && (
            <div className="mt-8 mb-8">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Social</h3>
              <div className="flex items-center gap-3">
                {socialList.map((link) => {
                  if (link.name === "facebook") {
                    return (
                      <a
                        key={link.id}
                        href={link.value}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <svg viewBox="0 0 24 24" fill="#1877F2" className="w-[42px] h-[42px]">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )
                  }
                  if (link.name === "instagram") {
                    return (
                      <a
                        key={link.id}
                        href={link.value}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <svg viewBox="0 0 24 24" className="w-[42px] h-[42px]">
                          <defs>
                            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f09433" />
                              <stop offset="25%" stopColor="#e6683c" />
                              <stop offset="50%" stopColor="#dc2743" />
                              <stop offset="75%" stopColor="#cc2366" />
                              <stop offset="100%" stopColor="#bc1888" />
                            </linearGradient>
                          </defs>
                          <rect width="24" height="24" rx="12" fill="url(#ig-grad)" />
                          <path
                            fill="#fff"
                            d="M16 6H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 9.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm3.5-5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z"
                          />
                          <circle fill="#fff" cx="12" cy="12" r="2" />
                        </svg>
                      </a>
                    )
                  }
                  if (link.name === "tiktok") {
                    return (
                      <a
                        key={link.id}
                        href={link.value}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <svg viewBox="0 0 24 24" className="w-[42px] h-[42px]">
                          <circle cx="12" cy="12" r="12" fill="#000" />
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

          <div className="mt-4 pt-4 text-center text-[11px] text-gray-400 font-medium">
            Snowvibes Co., Ltd. • Snowwhite by Snowvibes
          </div>
        </div>
      </div>
    </div>
  )
}
