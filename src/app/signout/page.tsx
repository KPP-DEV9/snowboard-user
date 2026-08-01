"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/app/actions/auth";
import { useLiff } from "@/hooks/useLiff";

export default function SignoutPage() {
  const router = useRouter();
  const { liff, isReady } = useLiff();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const doSignout = async () => {
      if (!isReady || isSigningOut) return;

      setIsSigningOut(true);

      // Clear server-side session (cookies)
      await clearSession();

      // Clear LIFF session if logged in
      if (liff && liff.isLoggedIn()) {
        liff.logout();
      }

      // Redirect to home page (login) and refresh to clear any cached states
      router.push("/");
      router.refresh();
    };

    doSignout();
  }, [liff, isReady, router, isSigningOut]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-[100px]">
      <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[14px] text-text-muted">กำลังออกจากระบบ...</p>
    </div>
  );
}
