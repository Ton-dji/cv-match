"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useI18nStore } from "@/store/useI18nStore";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { t } = useI18nStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });
      
      const data = await res.json().catch(() => null);
      
      if (!res.ok) {
        toast.error(`Payment failed: ${data?.error || 'Unknown error'}`);
        return;
      }

      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Payment failed", error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-indigo-100 p-3 rounded-full mb-4 w-fit">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center text-base">
            You've used your free AI generation. Upgrade to Pro to unlock unlimited AI CV Tailoring and Cover Letters!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
            <span className="text-slate-700">Unlimited AI CV Tailoring targeted to Job Descriptions</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
            <span className="text-slate-700">Unlimited AI Cover Letters</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
            <span className="text-slate-700">Native Translations (English, Spanish, French)</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Get Pro Access - $9.99
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
