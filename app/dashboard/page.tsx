"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { FileText, Trash2, Edit3, ArrowLeft, Loader2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { AuthButtons } from "@/components/AuthButtons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "sonner";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useRouter } from "next/navigation";

interface TailoredCV {
  id: string;
  jobTitle: string;
  company: string | null;
  score: number | null;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export default function CVDashboard() {
  const { data: session, status } = useSession();
  const [cvs, setCvs] = useState<TailoredCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setOptimizedCV, setJobDescription, setTargetLanguage, setAnalysis } = useApplicationStore();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchCVs();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const fetchCVs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cvs');
      if (res.ok) {
        const data = await res.json();
        setCvs(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load CV history");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCV = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    
    try {
      const res = await fetch(`/api/cvs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCvs(prev => prev.filter(cv => cv.id !== id));
        toast.success("CV deleted successfully");
      } else {
        toast.error("Failed to delete CV");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const loadCVIntoEditor = async (id: string) => {
    toast.loading("Loading CV...");
    try {
      const res = await fetch(`/api/cvs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOptimizedCV(data.content);
        setJobDescription(data.jobDescription);
        setTargetLanguage(data.language as any);
        setAnalysis(data.score ? { score: data.score, missingSkills: [], advice: "" } : null);
        toast.dismiss();
        router.push("/editor");
      } else {
        toast.dismiss();
        toast.error("Failed to load CV data");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("An error occurred while loading");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">My Resumes</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <AuthButtons session={session} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tailored CV History</h2>
            <p className="text-slate-500 mt-1">View and manage all the resumes you've optimized for specific jobs.</p>
          </div>
          <Link href="/editor" className={buttonVariants()}>New Resume</Link>
        </div>

        {status === "unauthenticated" ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Please log in to view your history</h3>
            <p className="text-slate-500 mb-6">Create an account to save your tailored CVs in the cloud automatically.</p>
            <AuthButtons session={session} />
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No CVs found</h3>
            <p className="text-slate-500 mb-6">You haven't optimized any resumes yet. Start by pasting a job description!</p>
            <Link href="/editor" className={buttonVariants()}>Tailor a CV now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map(cv => (
              <div key={cv.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{cv.jobTitle}</h3>
                  {cv.score && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                      {cv.score}% Match
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-6">
                  {cv.company && (
                    <p className="text-sm text-slate-600 font-medium">{cv.company}</p>
                  )}
                  <div className="flex items-center text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(cv.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    {cv.language}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none" 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadCVIntoEditor(cv.id)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Load Editor
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteCV(cv.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
