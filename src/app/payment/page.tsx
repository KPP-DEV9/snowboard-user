import { getCourseById } from "@/app/actions/course"
import { getSession } from "@/app/actions/auth"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"
import { Card } from "@/components/Ui/Card/Card"

import { PaymentButton } from "@/components/Button/PaymentButton"

interface PaymentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const resolvedSearchParams = await searchParams
  const courseId =
    typeof resolvedSearchParams.course_id === "string" ? resolvedSearchParams.course_id : ""

  if (!courseId) {
    return notFound()
  }

  let method =
    typeof resolvedSearchParams.method === "string" ? resolvedSearchParams.method : "credit"

  const { success, data: course } = await getCourseById(courseId)

  if (!success || !course) {
    return notFound()
  }

  const session = await getSession()
  if (!session?.user) return notFound()

  // let userCredit = 0
  // if (method === "credit") {
  //   const creditRes = await getCredit(session.user.id)
  //   const credit = creditRes.data as Credit
  //   if (credit?.user_id) {
  //     userCredit = credit?.balance || 0
  //   }
  // }

  const renderPaymentMethods = () => {
    switch (method.toLowerCase()) {
      case "qr":
        return (
          <div className="w-56 h-56 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-3 mb-6 relative group-hover:scale-105 transition-transform duration-500">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-black opacity-80"
              fill="currentColor"
            >
              <rect
                x="10"
                y="10"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="16" y="16" width="13" height="13" />
              <rect
                x="65"
                y="10"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="71" y="16" width="13" height="13" />

              <rect
                x="10"
                y="65"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="16" y="71" width="13" height="13" />

              <path d="M45,10 h10 v10 h-10 z M45,25 h10 v10 h-10 z M45,40 h10 v10 h-10 z" />
              <path d="M10,45 h10 v10 h-10 z M25,45 h10 v10 h-10 z" />
              <path d="M65,45 h10 v10 h-10 z M80,45 h10 v10 h-10 z" />
              <path d="M45,65 h10 v10 h-10 z M45,80 h10 v10 h-10 z" />

              <rect x="45" y="45" width="10" height="10" />
              <rect x="55" y="55" width="10" height="10" />
              <rect x="65" y="65" width="10" height="10" />
              <rect
                x="75"
                y="75"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
            </svg>
            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
          </div>
        )
      // case "credit":
      //   return (
      //     <div className="flex flex-col items-center gap-2 mb-6">
      //       <div className="flex items-center gap-2 bg-background-light dark:bg-background-dark rounded-full px-4 py-2">
      //         <div className="flex items-center gap-1 text-gold">
      //           <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
      //           <span className="font-bold text-[26px]">{numeral(userCredit).format("0,0")}</span>
      //         </div>
      //         <span className="text-[12px] text-gray-400 mt-1 uppercase">คงเหลือ</span>
      //       </div>
      //     </div>
      //   )
      case "bank_transfer":
        return (
          <div className="flex flex-col items-center pb-4">
            <p className="text-gray-400 mt-1 uppercase">
              ชื่อบัญชี: บริษัท เน็กซ์เจน ดิจิทัล โซลูชันส์ จำกัด <br />
              ธนาคาร: กสิกรไทย (KBANK) <br />
              ประเภทบัญชี: กระแสรายวัน
              <br />
              เลขที่บัญชี: 012-1-23456-7 <br />
              สาขา: ออลซีซั่นส์ เพลส
            </p>
          </div>
        )
      default:
        return null
    }
  }

  const renderLabel = () => {
    switch (method.toLowerCase()) {
      // case "credit":
      //   return {
      //     title: "ชำระด้วยเครดิต",
      //     description: "ยืนยันเพื่อชำระเงินด้วยเครดิตค่าคอร์สเรียน",
      //   }
      case "cash":
        return {
          title: "ชำระด้วยเงินสด",
          description: "ยืนยันชำระค่าคอร์สเรียนด้วยเงินสด",
        }
      case "qr":
        return {
          title: "ชำระด้วยคิวอาร์โค้ด",
          description: "ยืนยันชำระค่าคอร์สเรียนด้วยคิวอาร์โค้ด",
        }
      case "credit_card":
        return {
          title: "ชำระด้วยบัตรเครดิต",
          description: "ยืนยันชำระค่าคอร์สเรียนด้วยบัตรเครดิต",
        }
      case "bank_transfer":
        return {
          title: "ชำระด้วยการโอนเงิน",
          description: "ยืนยันชำระค่าคอร์สเรียนด้วยการโอนเงิน",
        }
      default:
        return {
          title: "",
          description: "",
        }
    }
  }

  return (
    <div className="p-6 flex flex-col min-h-screen pb-[100px] animate-fade-in">
      <Breadcrumbs
        title={"ชำระเงิน"}
        step={"PAYMENT"}
        urlBack={`/instructors/${123}/courses/${courseId}`}
      />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-foreground mb-2">{renderLabel().title}</h1>
          <p className="text-[14px] text-text-muted">{renderLabel().description}</p>
        </div>

        <Card className="px-6 pt-8 pb-4 w-full bg-white flex flex-col items-center shadow-xl shadow-gold/10 border-gold/30 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>

          {renderPaymentMethods()}
          <div className="text-center w-full">
            <div className="bg-gray-100 rounded-lg p-4 mb-2">
              <span className="text-[14px] text-gray-500 block mb-1">ยอดชำระเงิน</span>
              <span className="text-[28px] font-bold text-gray-900 tracking-tight">
                {/* {`${Inv(course.price)}`} */}
              </span>
            </div>
          </div>
        </Card>

        <div className="w-full mt-8 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-card/40 p-4 rounded-xl border border-card-border/50">
            <div className="flex flex-col">
              <span className="text-[12px] text-text-muted">คอร์สเรียน</span>
              <span className="text-[14px] font-bold text-foreground truncate max-w-[200px]">
                {course.title}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[12px] text-text-muted">ผู้สอน</span>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          <PaymentButton courseId={courseId} method={method} />
        </div>
      </div>
    </div>
  )
}
