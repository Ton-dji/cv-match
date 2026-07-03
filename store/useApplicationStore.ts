import { create } from 'zustand'

export type TargetLanguage = 'English' | 'Spanish' | 'French';

interface AnalysisResult {
  score: number;
  missingSkills: string[];
  advice: string;
}

interface ApplicationState {
  jobDescription: string;
  targetLanguage: TargetLanguage;
  optimizedCV: any | null;
  isGenerating: boolean;
  // Analysis State
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  // Theme State
  currentTheme: 'Modern' | 'Classic' | 'Minimalist';
  
  setJobDescription: (jd: string) => void;
  setTargetLanguage: (lang: TargetLanguage) => void;
  setOptimizedCV: (cv: any) => void;
  setIsGenerating: (isGen: boolean) => void;
  // Analysis Setters
  setAnalysis: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (isAn: boolean) => void;
  setTheme: (theme: 'Modern' | 'Classic' | 'Minimalist') => void;
  reset: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  jobDescription: '',
  targetLanguage: 'English',
  optimizedCV: null,
  isGenerating: false,
  analysis: null,
  isAnalyzing: false,
  currentTheme: 'Modern',
  setJobDescription: (jd) => set({ jobDescription: jd }),
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),
  setOptimizedCV: (cv) => set({ optimizedCV: cv }),
  setIsGenerating: (isGen) => set({ isGenerating: isGen }),
  setAnalysis: (result) => set({ analysis: result }),
  setIsAnalyzing: (isAn) => set({ isAnalyzing: isAn }),
  setTheme: (theme) => set({ currentTheme: theme }),
  reset: () => set({
    jobDescription: '',
    optimizedCV: null,
    analysis: null,
    isAnalyzing: false,
    isGenerating: false,
    // Keep targetLanguage and currentTheme as they are user preferences
  }),
}))
