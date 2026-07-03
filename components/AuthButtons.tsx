"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

// Note: Passing session from Server Component is faster for initial render,
// but we use useSession for client-side interactivity like sign out.
export function AuthButtons({ session }: { session: any }) {
  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">
          {session.user?.email}
        </span>
        <Button variant="ghost" onClick={() => signOut()} className="text-slate-600 hover:text-slate-900">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
        Sign In
      </Link>
      <Link href="/register" className={buttonVariants({ variant: "outline", className: "border-indigo-200 text-indigo-700 hover:bg-indigo-50" })}>
        Register
      </Link>
    </div>
  );
}
