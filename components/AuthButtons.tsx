"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useI18nStore } from "@/store/useI18nStore";

// Note: Passing session from Server Component is faster for initial render,
// but we use useSession for client-side interactivity like sign out.
export function AuthButtons({ session }: { session: any }) {
  const { t } = useI18nStore();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
          {session.user?.name || session.user?.email}
        </span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          {t('sign_out')}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => signIn()}>
      {t('sign_in')}
    </Button>
  );
}
