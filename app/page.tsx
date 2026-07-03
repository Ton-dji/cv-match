"use client";

import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { MasterProfileForm } from "@/components/MasterProfileForm";
import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFImportButton } from "@/components/PDFImportButton";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useSession } from "next-auth/react";
import { AuthButtons } from "@/components/AuthButtons";

export default function Dashboard() {
  const { reset } = useApplicationStore();
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">CV-Match</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <AuthButtons session={session} />
          <Link href="#profile" className={buttonVariants({ variant: "ghost" })}>
            Master Profile
          </Link>
          <Link href="/editor" onClick={() => reset()} className={buttonVariants()}>
            <Sparkles className="w-4 h-4 mr-2" />
            New Match
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Member Dashboard
          </h2>
          <p className="text-slate-500 mt-2">
            Manage your Master Profile and create tailored CVs for your job applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats or Welcome - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Start a New Application</h3>
              <p className="opacity-90 mb-6 text-sm">
                Paste a Job Description, choose a language, and let AI rewrite your CV perfectly.
              </p>
              <Link
                href="/editor"
                onClick={() => reset()}
                className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
              >
                Go to Match Editor
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
                <li>Keep your Master Profile updated with all your skills.</li>
                <li>Use bullet points for experience.</li>
                <li>Generate a new CV for every specific job offer.</li>
              </ul>
            </div>
          </div>

          {/* Master Profile Editor - Main Column */}
          <div className="lg:col-span-2" id="profile">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">Master Profile</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {session ? "Cloud Sync Active" : "Auto-saved locally"}
                  </span>
                </div>
                <PDFImportButton />
              </div>
              <MasterProfileForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
