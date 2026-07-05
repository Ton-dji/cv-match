import React, { useState } from 'react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useI18nStore } from '@/store/useI18nStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Download, Edit3, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function CoverLetterViewer() {
  const { optimizedCV, jobDescription } = useApplicationStore();
  const { language, t } = useI18nStore();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterProfile: optimizedCV, jobDescription, targetLanguage: language })
      });
      
      if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${res.status}`);
      }
      
      const data = await res.json();
      setCoverLetter(data.coverLetter || "Generated cover letter was empty.");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;
    
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(coverLetter, textWidth);
    let cursorY = 30;
    
    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(optimizedCV?.fullName || "Cover Letter", margin, cursorY);
    cursorY += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [optimizedCV?.email, optimizedCV?.phone].filter(Boolean).join(" | ");
    if (contactInfo) {
      doc.text(contactInfo, margin, cursorY);
      cursorY += 15;
    }
    
    // Body
    doc.setFontSize(11);
    for (let i = 0; i < lines.length; i++) {
        if (cursorY > 280) {
            doc.addPage();
            cursorY = 20;
        }
        doc.text(lines[i], margin, cursorY);
        cursorY += 6; // line height
    }
    
    doc.save(`Cover_Letter_${optimizedCV?.fullName?.replace(/\s+/g, '_') || 'CV'}.pdf`);
  };

  if (!jobDescription) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 border rounded-xl p-8 text-center">
        <Mail className="w-16 h-16 text-indigo-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Cover Letter Generator</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          To generate a highly tailored cover letter, please paste a Job Description in the Dashboard tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700 font-semibold">
          <Mail className="w-5 h-5" />
          {t('cover_letter_title')}
        </div>
        <div className="flex gap-2">
           {coverLetter && !isEditing && (
             <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" /> {t('edit')}
                </Button>
                <Button variant="default" size="sm" onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="w-4 h-4 mr-2" /> {t('download_pdf')}
                </Button>
             </>
           )}
           {coverLetter && isEditing && (
               <Button variant="default" size="sm" onClick={() => setIsEditing(false)} className="bg-green-600 hover:bg-green-700">
                   <Save className="w-4 h-4 mr-2" /> {t('save')}
               </Button>
           )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
        {!coverLetter && !isGenerating && (
           <div className="h-full flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">{t('ready_cover_letter')}</h3>
             <p className="text-slate-500 text-sm max-w-sm mb-6">
                {t('cover_letter_desc')}
             </p>
             <Button onClick={generateCoverLetter} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                {t('generate_cover_letter')}
             </Button>
           </div>
        )}

        {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-indigo-800 font-medium">{t('writing_cover_letter')}</p>
                <p className="text-indigo-500 text-sm mt-1">{t('analyzing_job_desc')}</p>
            </div>
        )}

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm mb-4">
                Error: {error}
            </div>
        )}

        {coverLetter && !isGenerating && (
            <div className="bg-white border rounded-lg shadow-sm p-8 min-h-full">
                {isEditing ? (
                    <Textarea 
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="min-h-[500px] border-indigo-200 focus-visible:ring-indigo-500 resize-none text-base leading-relaxed"
                    />
                ) : (
                    <div className="whitespace-pre-wrap text-slate-800 text-base leading-relaxed font-serif">
                        {coverLetter}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
