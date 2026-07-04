'use client';

import React from 'react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useI18nStore } from '@/store/useI18nStore';

export function AnalysisDashboard() {
  const { analysis } = useApplicationStore();
  const { t } = useI18nStore();

  if (!analysis) return null;

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6 animate-in fade-in slide-in-from-top-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
         <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                {t('ai_match_analysis')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{t('based_on_job_desc')}</p>
         </div>
         <div className="flex flex-col items-end">
            <span className={`text-3xl font-black ${analysis.score > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                {analysis.score}%
            </span>
            <span className="text-xs font-semibold uppercase text-slate-400">{t('match_score')}</span>
         </div>
      </div>

      {/* Progress Bar Visual */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden">
            <div 
            className={`h-full transition-all duration-1000 ease-out ${analysis.score > 70 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-orange-500 to-orange-400'}`} 
            style={{ width: `${analysis.score}%` }}
            ></div>
      </div>
      
      {/* Missing Keywords */}
      {analysis.missingSkills.length > 0 ? (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm font-semibold text-slate-700">{t('missing_key_skills')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill: string, i: number) => (
                <span key={i} className="text-xs bg-red-50 text-red-700 font-medium px-2.5 py-1 rounded-md border border-red-100">
                    {skill}
                </span>
                ))}
            </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-sm font-medium">{t('no_missing_skills')}</span>
        </div>
      )}

      {/* Advice */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wide">{t('ai_recommendation')}</p>
        <p className="text-sm text-blue-900 leading-relaxed italic">
            &quot;{analysis.advice}&quot;
        </p>
      </div>

    </div>
  );
}
