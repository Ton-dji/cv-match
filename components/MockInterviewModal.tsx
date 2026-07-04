'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useI18nStore } from '@/store/useI18nStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MockInterviewModal({ isOpen, onClose }: MockInterviewModalProps) {
  const { t } = useI18nStore();
  const { jobDescription, optimizedCV, targetLanguage } = useApplicationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-start interview when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: [],
          optimizedCV,
          jobDescription,
          targetLanguage,
        }),
      });

      if (!res.ok) throw new Error('Failed to start interview');

      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: newMessages,
          optimizedCV,
          jobDescription,
          targetLanguage,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            {t('practice_interview') || 'AI Mock Interview'}
          </DialogTitle>
          <DialogDescription>
            {t('interview_desc') || 'The AI will ask you questions based on your tailored CV and the target job description.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {t('ai_typing') || 'Interviewer is typing...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('type_answer') || 'Type your answer...'}
              disabled={isLoading}
              className="flex-1 bg-white"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
