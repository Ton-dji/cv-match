'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MasterProfile } from '@/store/useProfileStore';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceBuilderButtonProps {
  onComplete: (parsedData: Partial<MasterProfile>) => void;
  disabled?: boolean;
}

export function VoiceBuilderButton({ onComplete, disabled }: VoiceBuilderButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Need to use any to bypass TS complaints about SpeechRecognition
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
            transcriptRef.current += ' ' + currentTranscript;
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setError(event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;
    transcriptRef.current = '';
    setError(null);
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      setError('Could not start microphone');
    }
  };

  const stopRecording = async () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error(e);
    }
    
    setIsRecording(false);
    
    if (transcriptRef.current.trim().length === 0) {
      return; // Nothing recorded
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript: transcriptRef.current })
      });
      
      const json = await res.json();
      console.log("Microphone recorded:", transcriptRef.current);
      console.log("AI returned JSON:", json);
      
      if (json.data) {
        onComplete(json.data);
      } else {
        setError('Failed to parse transcript.');
      }
    } catch (err) {
      console.error(err);
      setError('Error processing voice data.');
    } finally {
      setIsProcessing(false);
      transcriptRef.current = '';
    }
  };

  if (error && !recognitionRef.current) {
    return <span className="text-xs text-red-500">Browser doesn't support Voice API</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={isRecording ? "destructive" : "default"} 
        size="sm" 
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        className={isRecording ? "animate-pulse bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing AI...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-4 h-4 mr-2" /> Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" /> Dictate Profile
          </>
        )}
      </Button>
      {isRecording && <span className="text-xs text-red-500 font-medium">Listening...</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
