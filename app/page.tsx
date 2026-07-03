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
import { motion } from "framer-motion";

export default function Dashboard() {
  const { reset } = useApplicationStore();
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/50 py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">CV-Match</h1>
        </div>
        <nav className="flex flex-wrap gap-2 md:gap-4 items-center justify-center mt-4 sm:mt-0">
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
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200"
            >
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
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-xl shadow-slate-100"
            >
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Pro Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
                <li>Keep your Master Profile updated with all your skills.</li>
                <li>Use bullet points for experience.</li>
                <li>Generate a new CV for every specific job offer.</li>
              </ul>
            </div>
          </div>

          {/* Master Profile Editor - Main Column */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2" 
            id="profile"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">Master Profile</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                    {session ? "● Cloud Sync Active" : "● Auto-saved locally"}
                  </span>
                </div>
                <PDFImportButton />
              </div>
              <MasterProfileForm />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
