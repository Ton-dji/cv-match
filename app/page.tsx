"use client";

import React, { useState } from "react";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { MasterProfileForm } from "@/components/MasterProfileForm";
import { FileText, Sparkles, Upload, FileSignature, ArrowRight, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFImportButton } from "@/components/PDFImportButton";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useSession } from "next-auth/react";
import { AuthButtons } from "@/components/AuthButtons";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { reset } = useApplicationStore();
  const { data: session } = useSession();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

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
          <Button 
            variant="ghost" 
            onClick={() => setShowProfileSettings(!showProfileSettings)}
            className="text-slate-600"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Profile Settings
          </Button>
          <Link href="/editor" onClick={() => reset()} className={buttonVariants()}>
            <Sparkles className="w-4 h-4 mr-2" />
            New Match
          </Link>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Get the job. <span className="text-indigo-600">Every time.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Follow these 3 simple steps to generate a perfectly tailored resume that beats the ATS and lands you interviews.
            </p>
          </motion.div>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-xl shadow-slate-100 flex flex-col items-center text-center relative z-10"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm border border-indigo-200">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Old CV</h3>
            <p className="text-sm text-slate-500 mb-6">Let AI extract your entire career history into your Master Profile.</p>
            <PDFImportButton />
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-xl shadow-slate-100 flex flex-col items-center text-center relative z-10"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm border border-indigo-200">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Paste Job Link</h3>
            <p className="text-sm text-slate-500 mb-6">Paste the description of the exact job you want to apply for.</p>
            <FileSignature className="w-10 h-10 text-slate-300" />
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 flex flex-col items-center text-center relative z-10"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-sm border border-white/30">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Get Tailored PDF</h3>
            <p className="text-sm text-indigo-100 mb-6">Watch our AI rewrite your CV perfectly for that specific job.</p>
            <Link
              href="/editor"
              onClick={() => reset()}
              className={cn(buttonVariants({ variant: "secondary" }), "w-full hover:scale-105 transition-transform font-bold")}
            >
              Start Magic <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Hidden Master Profile */}
        <AnimatePresence>
          {showProfileSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              id="profile"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-100 p-6 sm:p-8 mt-4">
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
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
