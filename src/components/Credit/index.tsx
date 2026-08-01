import { Card } from "../Ui/Card/Card"
import History from "../History"
import { SumaryCourse } from "@/types/course"
import { UserBalance } from "@/types/userBalance"

import numeral from "numeral"

interface Props {
  summary: SumaryCourse[]
  userBalances?: UserBalance[]
}

export function CreditCard({ summary, userBalances }: Props) {
  return (
    <Card className="bg-gradient-to-br from-card-bg to-[#2a2212] border border-gold-dark h-[222px] overflow-y-scroll">
      {/* <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] tracking-[2px] text-gold font-bold">MY BALANCES</span>
        <span className="text-[10px] text-gold border border-gold px-2 py-1 rounded font-bold">
          GOLD TIER
        </span>
      </div> */}

      <div className="space-y-3">
        {userBalances?.map((balance) => (
          <div
            key={balance.id}
            className="bg-white/5 rounded-lg p-4 border border-gold/20 transition-all hover:bg-white/10 hover:border-gold/40"
          >
            <div className="text-sm text-gold font-bold mb-3">MY BALANCES</div>
            <div className="grid grid-cols-3 gap-2 divide-x divide-gold/10">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[22px] font-bold leading-none text-white">
                  {balance.total_hour || 0}
                </span>
                <span className="text-[10px] text-gold/80 uppercase tracking-wider mt-1">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[22px] font-bold leading-none text-white">
                  {balance.total_times || 0}
                </span>
                <span className="text-[10px] text-gold/80 uppercase tracking-wider mt-1">
                  Times
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[22px] font-bold leading-none text-white">
                  {balance.total_days || 0}
                </span>
                <span className="text-[10px] text-gold/80 uppercase tracking-wider mt-1">Days</span>
              </div>
            </div>
          </div>
        ))
        // ) : (
        //   <div className="flex items-center justify-between">
        //     <div className="flex items-baseline gap-2">
        //       <span className="text-[24px] font-bold leading-none text-white">
        //         {/* {numeral(credit?.balance).format("0,0") || 0} */}
        //       </span>
        //       <span className="text-[14px] text-text-muted">เครดิตคงเหลือ</span>
        //     </div>
        //   </div>
        }
      </div>

      <History summary={summary} />
    </Card>
  )
}
