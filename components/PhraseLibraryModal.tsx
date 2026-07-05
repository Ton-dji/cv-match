import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, BookOpen, AlertCircle } from 'lucide-react';

interface PhraseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole: string;
  jobDescription?: string;
  missingSkills?: string[];
  targetLanguage: string;
  onAddPhrase: (phrase: string) => void;
}

export function PhraseLibraryModal({
  isOpen,
  onClose,
  defaultRole,
  jobDescription,
  missingSkills,
  targetLanguage,
  onAddPhrase
}: PhraseLibraryModalProps) {
  const [role, setRole] = useState(defaultRole || "");
  const [phrases, setPhrases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhrases = async () => {
    if (!role.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/phrase-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, jobDescription, missingSkills, targetLanguage })
      });
      
      if (!res.ok) throw new Error("Failed to fetch phrases");
      
      const data = await res.json();
      if (data.phrases && Array.isArray(data.phrases)) {
        setPhrases(data.phrases);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const highlightKeywords = (text: string) => {
    if (!missingSkills || missingSkills.length === 0) return <span>{text}</span>;
    
    // Create a regex to match any of the missing skills case-insensitively
    const escapedSkills = missingSkills.map(s => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
    const regex = new RegExp(`(${escapedSkills.join('|')})`, 'gi');
    
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => {
          const isMatch = missingSkills.some(skill => skill.toLowerCase() === part.toLowerCase());
          return isMatch ? (
            <span key={i} className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            ATS-Optimized Phrase Library
          </DialogTitle>
          <DialogDescription>
            Enter a job title to generate highly-optimized bullet points.
            {missingSkills && missingSkills.length > 0 && (
              <span className="block mt-2 text-indigo-600 font-medium bg-indigo-50 p-2 rounded-md border border-indigo-100">
                ✨ AI is actively injecting your missing ATS keywords: {missingSkills.join(', ')}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-2">
          <Input 
            placeholder="e.g. Frontend Developer, Marketing Manager..." 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPhrases()}
          />
          <Button onClick={fetchPhrases} disabled={isLoading || !role.trim()} className="bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Generate
          </Button>
        </div>

        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2 mt-2 bg-red-50 p-2 rounded">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {phrases.map((phrase, i) => (
            <div key={i} className="flex gap-3 items-start p-3 hover:bg-slate-50 border rounded-lg transition-colors group">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 shrink-0 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                onClick={() => onAddPhrase(phrase)}
                title="Add to description"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <p className="text-sm text-slate-700 pt-1.5 leading-relaxed flex-1">
                {highlightKeywords(phrase)}
              </p>
            </div>
          ))}
          {phrases.length === 0 && !isLoading && !error && (
            <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed rounded-xl">
              Click Generate to see tailored phrases
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
