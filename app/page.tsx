"use client";

import React from "react";
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
import { useI18nStore } from "@/store/useI18nStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Dashboard() {
  const { reset } = useApplicationStore();
  const { data: session } = useSession();
  const { t } = useI18nStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <header className="bg-white lg:bg-white/70 lg:backdrop-blur-md border-b border-slate-200/50 py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">{t('app_title')}</h1>
        </div>
        <nav className="flex flex-wrap gap-2 md:gap-4 items-center justify-center mt-4 sm:mt-0">
          <LanguageSwitcher />
          <AuthButtons session={session} />
          <Link href="/editor" onClick={() => reset()} className={buttonVariants()}>
            <Sparkles className="w-4 h-4 mr-2" />
            {t('new_match')}
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('dashboard_title')}
          </h2>
          <p className="text-slate-500 mt-2">
            {t('dashboard_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Master Profile Editor - Left Column (lg:col-span-2) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 order-1 lg:order-1" 
            id="profile"
          >
            <div className="bg-white/95 lg:bg-white/80 lg:backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">{t('master_profile')}</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                    {session ? t('cloud_sync_active') : t('auto_saved')}
                  </span>
                </div>
                <PDFImportButton />
              </div>
              <MasterProfileForm />
            </div>
          </motion.div>

          {/* Quick Stats or Welcome - Right Column (lg:col-span-1) */}
          <div className="lg:col-span-1 order-2 lg:order-2 space-y-6">
            <motion.div 
              className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200"
            >
              <h3 className="text-lg font-semibold mb-2">{t('start_new_app')}</h3>
              <p className="opacity-90 mb-6 text-sm">
                {t('start_new_desc')}
              </p>
              <Link
                href="/editor"
                onClick={() => reset()}
                className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
              >
                {t('go_to_editor')}
              </Link>
            </motion.div>

            <motion.div 
              className="bg-white/95 lg:bg-white/60 lg:backdrop-blur-sm rounded-2xl p-6 border border-white shadow-xl shadow-slate-100"
            >
              <h3 className="text-lg font-semibold mb-4 text-slate-800">{t('pro_tips')}</h3>
              <ul className="space-y-3 text-sm text-slate-600 list-disc list-inside">
                <li>{t('tip_1')}</li>
                <li>{t('tip_2')}</li>
                <li>{t('tip_3')}</li>
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
