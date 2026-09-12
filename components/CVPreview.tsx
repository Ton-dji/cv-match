
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { CVDocument } from './CVDocument';
import { MasterProfile } from '@/store/useProfileStore';
import CVDownloadButton from './CVDownloadButton';
import { FileText, Smartphone } from 'lucide-react';

interface CVPreviewProps {
  data: MasterProfile;
  language?: string;
  themeName?: 'Modern' | 'Classic' | 'Minimalist' | 'Executive' | 'Creative';
}

export default function CVPreview({ data, language, themeName }: CVPreviewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center">
        <Smartphone className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-bold text-slate-700 mb-2">Live Preview Unavailable on Mobile</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          Mobile browsers do not support live PDF previews. Please download the document to view your tailored CV.
        </p>
        <CVDownloadButton 
          data={data} 
          fileName={`CV_${data.fullName?.replace(/\s+/g, '_') || 'Tailored'}`} 
          language={language}
          themeName={themeName as any}
        />
      </div>
    );
  }

  const document = useMemo(() => <CVDocument data={data} language={language} themeName={themeName as any} />, [data, language, themeName]);
  const [instance, updateInstance] = usePDF({ document });

  // Update PDF when data/theme/language changes
  useEffect(() => {
    updateInstance(document);
  }, [document, updateInstance]);

  return (
    <div className="w-full flex-1 min-h-[800px] lg:min-h-0 pointer-events-none lg:pointer-events-auto bg-slate-200 flex flex-col">
      {instance.loading ? (
        <div className="w-full flex-1 flex items-center justify-center text-slate-500">
          Generating PDF...
        </div>
      ) : instance.url ? (
        <iframe 
          key={`${themeName}-${language}`} 
          src={`${instance.url}#view=Fit&toolbar=0&navpanes=0`} 
          className="w-full flex-1 border-none"
        />
      ) : (
        <div className="w-full flex-1 flex items-center justify-center text-red-500">
          Failed to load PDF preview.
        </div>
      )}
    </div>
  );
}
