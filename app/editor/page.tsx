'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useProfileStore } from '@/store/useProfileStore';
import { useApplicationStore, TargetLanguage } from '@/store/useApplicationStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CVForm } from '@/components/CVForm';
import { ArrowRight, Loader2, Sparkles, Wand2, Palette, LayoutTemplate, Type, Bot, Eye, Mail, ArrowLeft, Edit3 } from 'lucide-react';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { CoverLetterViewer } from '@/components/CoverLetterViewer';
import { PaymentModal } from '@/components/PaymentModal';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18nStore } from '@/store/useI18nStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

const CVDownloadButton = dynamic(() => import('@/components/CVDownloadButton'), { 
  ssr: false,
  loading: () => <Button variant="outline" disabled size="sm">Loading PDF...</Button> 
});

const CVPreview = dynamic(() => import('@/components/CVPreview'), { 
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading Preview...</div> 
});

export default function MatchEditor() {
  const [activeTab, setActiveTab] = React.useState<'editor' | 'preview' | 'design' | 'cover-letter'>('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isScraping, setIsScraping] = React.useState(false);
  const { profile, setThemeColor, setFontFamily } = useProfileStore();
  const { t } = useI18nStore();
  const { 
    jobDescription, 
    targetLanguage, 
    optimizedCV, 
    isGenerating, 
    setJobDescription, 
    setTargetLanguage, 
    setOptimizedCV, 
    setIsGenerating,
    isAnalyzing,
    setAnalysis,
    setIsAnalyzing,
    currentTheme,
    setTheme
  } = useApplicationStore();

  // Initialize optimizedCV with Master Profile if empty
  useEffect(() => {
    if (!optimizedCV && profile) {
      setOptimizedCV(profile);
    }
  }, [profile, optimizedCV, setOptimizedCV]);

  // Sync Target Language dropdown with UI language automatically
  const uiLanguage = useI18nStore((state) => state.language);
  useEffect(() => {
    if (uiLanguage === 'es') setTargetLanguage('Spanish');
    else if (uiLanguage === 'fr') setTargetLanguage('French');
    else if (uiLanguage === 'en') setTargetLanguage('English');
  }, [uiLanguage, setTargetLanguage]);

  const handleJobDescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJobDescription(value);

    // If it looks like a single URL, try to scrape it
    if (value.trim().startsWith('http') && !value.includes(' ')) {
      setIsScraping(true);
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: value.trim() })
        });
        
        const data = await res.json();
        
        if (res.ok && data.text) {
          setJobDescription(data.text);
          toast.success('Successfully extracted job description from URL');
        } else {
          setJobDescription(''); // Clear the URL so they can paste text
          toast.error(data.error || 'Failed to extract text from URL');
        }
      } catch (error) {
        toast.error('An error occurred while fetching the URL');
      } finally {
        setIsScraping(false);
      }
    }
  };

  const handleOptimize = async () => {
    if (!jobDescription) return;

    setIsGenerating(true);
    setIsAnalyzing(true);
    try {
      // 1. Generate the tailored CV
      const optimizeResponse = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterProfile: profile,
          jobDescription,
          targetLanguage
        })
      });

      if (!optimizeResponse.ok) {
        const err = await optimizeResponse.json();
        if (err.error === 'INSUFFICIENT_CREDITS') {
          setShowPaymentModal(true);
          return;
        }
        throw new Error(err.error || 'Optimization failed');
      }
      const optimizedData = await optimizeResponse.json();
      setOptimizedCV(optimizedData);

      // 2. Run analysis on the newly tailored CV for the dashboard
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterProfile: optimizedData, jobDescription, targetLanguage: targetLanguage })
      });
      
      let finalScore = null;
      if (analyzeResponse.ok) {
        const analyzeData = await analyzeResponse.json();
        setAnalysis(analyzeData);
        finalScore = analyzeData.score;
      }

      // 3. Save to database for history
      try {
        await fetch('/api/cvs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: optimizedData.title || "Tailored CV",
            company: "", // Could be extracted in the future
            jobDescription,
            score: finalScore,
            language: targetLanguage,
            content: optimizedData
          })
        });
      } catch (err) {
        console.error("Failed to save CV history:", err);
      }

      toast.success(t('app_title') + ": " + t('download_pdf')); // using generic success message for now
      setActiveTab('preview'); // Automatically switch to preview
      
      // Auto-scroll to the preview panel on mobile so the user sees the generated CV
      setTimeout(() => {
        document.getElementById('preview-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to tailor CV: ${message}`);
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  };

  // Pre-defined accents
  const colorPresets = [
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#db2777', // Pink
    '#854d0e', // Bronze
    '#7c3aed', // Violet
    '#0f172a', // Slate
    '#000000', // Black
  ];

  const fontOptions = [
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Times New Roman', value: 'Times-Roman' },
    { name: 'Courier', value: 'Courier' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white lg:bg-white/70 lg:backdrop-blur-md border-b py-3 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-20 shadow-sm gap-3 sm:gap-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
               <ArrowLeft className="w-4 h-4 mr-2" /> {t('back_to_master')}
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-l pl-4 border-slate-200">
            <Sparkles className="w-5 h-5 text-indigo-600"/> {t('match_editor')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {optimizedCV && (
            <CVDownloadButton 
              data={optimizedCV} 
              fileName={`CV_${optimizedCV.fullName.replace(/\s+/g, '_')}_${targetLanguage}.pdf`} 
              language={targetLanguage}
              themeName={currentTheme}
            />
          )}
        </div>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row lg:h-[calc(100vh-60px)] lg:overflow-hidden h-auto">
        
        {/* Job Details Panel (Now Top on mobile / Right on desktop) */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-4 lg:p-6 lg:h-full bg-white relative pb-24 lg:pb-6 z-10 lg:z-auto order-1 lg:order-2 shadow-[0_-10px_15px_-3px_rgb(0,0,0,0.1)] lg:shadow-none">
          <div className="space-y-6 max-w-xl mx-auto">
            
            <Card className="border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50/50 pb-4">
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Wand2 className="w-5 h-5"/> {t('job_details')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('target_language')}</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-slate-700">{t('job_description')}</label>
                  <Textarea 
                    placeholder={t('job_description_placeholder')}
                    className={`min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500 ${isScraping ? 'opacity-50' : ''}`}
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    disabled={isScraping || isGenerating}
                  />
                  {isScraping && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-6">
                      <div className="bg-white/80 p-2 rounded-lg flex items-center shadow-sm">
                        <Loader2 className="w-5 h-5 mr-2 text-indigo-600 animate-spin" /> 
                        <span className="text-sm font-medium text-slate-700">Extracting text from URL...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleOptimize} 
                    disabled={isGenerating || !jobDescription} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 py-6 text-lg rounded-xl transition-all hover:-translate-y-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('tailoring')}
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" /> {t('tailor_my_cv')} <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-sm text-slate-500 text-center">
              <p>{t('based_on_master')}</p>
              <p>{t('ai_will_rewrite')}</p>
            </div>
          </div>
        </div>

        {/* Preview/Edit Panel (Now Bottom on mobile / Left on desktop) */}
        <div id="preview-panel" className="order-2 lg:order-1 bg-slate-100 p-4 lg:p-6 lg:overflow-y-auto h-auto lg:h-full lg:w-1/2 w-full pb-20 flex flex-col">
           <div className="max-w-3xl mx-auto w-full h-full flex flex-col min-h-[800px] lg:min-h-0">
             
             {/* Tabs - Sticky Bottom on Mobile, Top on Desktop */}
             <div className="fixed bottom-0 left-0 right-0 z-30 lg:static lg:mb-4 bg-white/95 lg:bg-transparent lg:backdrop-blur-md border-t lg:border-t-0 border-slate-200 p-3 lg:p-0 flex justify-center lg:justify-between items-center w-full shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] lg:shadow-none">
               <div className="bg-slate-100/80 lg:bg-white rounded-full lg:rounded-lg p-1 border border-slate-200 inline-flex shadow-sm w-full lg:w-auto max-w-xl justify-between">
                  <button 
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 lg:flex-none px-4 py-2 lg:py-1.5 text-sm font-medium rounded-full lg:rounded-md transition-all ${activeTab === 'editor' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                       <Edit3 className="w-4 h-4" />
                       <span className="hidden sm:inline">{t('manual_edit')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 lg:flex-none px-4 py-2 lg:py-1.5 text-sm font-medium rounded-full lg:rounded-md transition-all ${activeTab === 'design' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                       <Palette className="w-4 h-4" />
                       <span className="hidden sm:inline">{t('design')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 lg:flex-none px-4 py-2 lg:py-1.5 text-sm font-medium rounded-full lg:rounded-md transition-all ${activeTab === 'preview' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('preview_tab')}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('cover-letter')}
                    className={`flex-1 lg:flex-none px-4 py-2 lg:py-1.5 text-sm font-medium rounded-full lg:rounded-md transition-all ${activeTab === 'cover-letter' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('cover_letter_tab')}</span>
                    </div>
                  </button>
               </div>
             </div>
             
             <div className="flex-1 bg-white/95 lg:bg-white/80 lg:backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mb-16 lg:mb-0">
               {optimizedCV ? (
                 <>
                  {activeTab === 'editor' && (
                     <div className="p-6 overflow-y-auto">
                        <CVForm 
                          data={optimizedCV} 
                          onChange={setOptimizedCV} 
                          language={targetLanguage}
                          themeName={currentTheme}
                        />
                     </div>
                  )}

                  {activeTab === 'design' && (
                    <div className="p-6 space-y-8 overflow-y-auto">
                        {/* Template Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-blue-600" /> {t('choose_template')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                {['Modern', 'Classic', 'Minimalist', 'Executive', 'Creative'].map((t) => (
                                    <div 
                                        key={t}
                                        onClick={() => setTheme(t as any)}
                                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:scale-105 ${currentTheme === t ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
                                    >
                                        <div className="h-24 bg-slate-200 mb-3 rounded-md flex items-center justify-center text-slate-400 font-medium">
                                            {t} Preview
                                        </div>
                                        <p className="font-medium text-center text-slate-700">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Palette className="w-5 h-5 text-pink-600" /> {t('theme_color')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {colorPresets.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setThemeColor(color);
                                            // Also update local optimizedCV copy for immediate feedback if needed, 
                                            // but store update should trigger re-render if we connect it right.
                                            // Since optimizedCV is disconnected from store profle updates, we need to sync manual edits.
                                            setOptimizedCV({ ...optimizedCV, themeColor: color });
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${optimizedCV.themeColor === color ? 'border-slate-900 scale-110 ring-2 ring-slate-200' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                                <div className="relative">
                                    <input 
                                        type="color" 
                                        className="w-10 h-10 rounded-full cursor-pointer opacity-0 absolute inset-0"
                                        onChange={(e) => {
                                            setThemeColor(e.target.value);
                                            setOptimizedCV({ ...optimizedCV, themeColor: e.target.value });
                                        }}
                                    />
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50">
                                        <Palette className="w-5 h-5 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Font Selection */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Type className="w-5 h-5 text-emerald-600" /> {t('typography')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {fontOptions.map((font) => (
                                    <button
                                        key={font.value}
                                        onClick={() => {
                                            setFontFamily(font.value);
                                            setOptimizedCV({ ...optimizedCV, fontFamily: font.value });
                                        }}
                                        className={`px-4 py-3 rounded-lg border text-sm transition-all ${optimizedCV.fontFamily === font.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}
                                        style={{ fontFamily: font.value === 'Times-Roman' ? 'Times New Roman' : font.value === 'Courier' ? 'Courier New' : 'Arial' }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Layout Controls */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-purple-600" /> Layout Scale
                            </h3>
                            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-slate-700">Font Size ({optimizedCV.fontSizeScale || 1.0}x)</label>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.8" max="1.3" step="0.05" 
                                        className="w-full"
                                        value={optimizedCV.fontSizeScale || 1.0}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setOptimizedCV({ ...optimizedCV, fontSizeScale: val });
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>Small</span>
                                        <span>Large</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-slate-700">Spacing ({optimizedCV.lineSpacing || 1.0}x)</label>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.8" max="1.5" step="0.05" 
                                        className="w-full"
                                        value={optimizedCV.lineSpacing || 1.0}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setOptimizedCV({ ...optimizedCV, lineSpacing: val });
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>Compact</span>
                                        <span>Spacious</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setOptimizedCV({ 
                                        ...optimizedCV, 
                                        fontSizeScale: Math.max(0.65, (optimizedCV.fontSizeScale || 1.0) - 0.05), 
                                        lineSpacing: Math.max(0.65, (optimizedCV.lineSpacing || 1.0) - 0.05) 
                                    })}
                                    className="w-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center transition-all shadow-sm"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Magic Fit (1 Page)
                                </button>
                            </div>
                        </div>
                    </div>
                  )}

                  {activeTab === 'preview' && (
                     <div className="flex flex-col h-full">
                       <div className="px-4">
                         <AnalysisDashboard />
                       </div>
                       <div className="flex-1 overflow-auto min-h-[800px] lg:min-h-0">
                         <CVPreview data={optimizedCV} language={targetLanguage} themeName={currentTheme} />
                       </div>
                       <div className="p-4 border-t bg-white flex justify-center gap-4">
                       </div>
                     </div>
                  )}

                  {activeTab === 'cover-letter' && (
                     <div className="flex flex-col h-full">
                       <div className="flex-1 overflow-auto p-4">
                         <CoverLetterViewer />
                       </div>
                     </div>
                  )}
                 </>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 text-center">
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-50 p-6 rounded-full mb-6"
                   >
                     <Wand2 className="w-12 h-12 text-indigo-400" />
                   </motion.div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Optimize</h3>
                   <p className="max-w-xs mx-auto">Paste a Job Description on the left and click Optimize to generate a tailored CV instantly.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </div>
  );
}
