'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProfileStore, MasterProfile, Experience, Education } from '@/store/useProfileStore';
import { useI18nStore } from '@/store/useI18nStore';

export function PDFImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setProfile } = useProfileStore();
  const { t } = useI18nStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to parse PDF');
      }

      const data: Partial<MasterProfile> = await response.json();
      
      // Ensure IDs are present for lists
      if (data.experience) {
        data.experience = data.experience.map((exp: Experience) => ({ ...exp, id: exp.id || crypto.randomUUID() }));
      }
      if (data.education) {
        data.education = data.education.map((edu: Education) => ({ ...edu, id: edu.id || crypto.randomUUID() }));
      }

      setProfile(data);
      toast.success(t("profile_imported") || "Profile imported successfully!");
    } catch (error) {
      console.error('Error importing PDF:', error);
      toast.error(`${t("error_importing") || "Error importing PDF"}: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept=".pdf" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('importing') || "Importing..."}
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" /> {t('import_pdf') || "Import from PDF"}
          </>
        )}
      </Button>
    </>
  );
}
