
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
  // Add key to PDFViewer to force full remount on theme/language change
  return (
    <div className="w-full h-[800px] pointer-events-auto">
      <PDFViewer key={`${themeName}-${language}`} className="w-full h-full border-none" showToolbar={false}>
        <CVDocument data={data} language={language} themeName={themeName as any} />
      </PDFViewer>
    </div>
  );
}
