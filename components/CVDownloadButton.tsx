'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVDocument } from './CVDocument';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { MasterProfile } from '@/store/useProfileStore';

interface CVDownloadButtonProps {
  data: MasterProfile;
  fileName: string;
  language?: string;
  themeName?: 'Modern' | 'Classic' | 'Minimalist';
}

export default function CVDownloadButton({ data, fileName, language, themeName }: CVDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<CVDocument data={data} language={language} themeName={themeName} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button disabled={loading} size="sm">
          <Download className="w-4 h-4 mr-2" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
