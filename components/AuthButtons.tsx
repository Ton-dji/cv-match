"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useI18nStore } from "@/store/useI18nStore";
import Link from "next/link";

// Note: Passing session from Server Component is faster for initial render,
// but we use useSession for client-side interactivity like sign out.
export function AuthButtons({ session }: { session: any }) {
  const { t } = useI18nStore();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {(session?.user as any)?.role === "ADMIN" && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100">
              Admin Panel
            </Button>
          </Link>
        )}
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
