'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVDocument } from './CVDocument';
import { Button } from './ui/button';
import { Download, FileText } from 'lucide-react';
import { MasterProfile } from '@/store/useProfileStore';
import { generateDocx } from '@/lib/docxGenerator';

interface CVDownloadButtonProps {
  data: MasterProfile;
  fileName: string;
  language?: string;
  themeName?: 'Modern' | 'Classic' | 'Minimalist';
}

export default function CVDownloadButton({ data, fileName, language, themeName }: CVDownloadButtonProps) {
  const handleDocxDownload = async () => {
    try {
      await generateDocx(data, fileName);
    } catch (error) {
      console.error('Error generating DOCX:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <PDFDownloadLink
        document={<CVDocument data={data} language={language} themeName={themeName} />}
        fileName={`${fileName}.pdf`}
      >
        {({ loading }) => (
          <Button disabled={loading} size="sm" variant="default">
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'PDF...' : 'PDF'}
          </Button>
        )}
      </PDFDownloadLink>
      
      <Button size="sm" variant="outline" onClick={handleDocxDownload}>
        <FileText className="w-4 h-4 mr-2" />
        Word (.docx)
      </Button>
    </div>
  );
}
