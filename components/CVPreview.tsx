
'use client';

import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
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

  return (
    <div className="w-full h-[800px] lg:h-full pointer-events-none lg:pointer-events-auto bg-slate-200 flex flex-col flex-1">
      <PDFViewer key={`${themeName}-${language}`} style={{ flex: 1, width: '100%', height: '100%', border: 'none' }} showToolbar={false}>
        <CVDocument data={data} language={language} themeName={themeName as any} />
      </PDFViewer>
    </div>
  );
}
