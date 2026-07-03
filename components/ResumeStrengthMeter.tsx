
import React from 'react';
import { MasterProfile } from '@/store/useProfileStore';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResumeStrengthMeterProps {
  data: MasterProfile;
}

export const ResumeStrengthMeter = ({ data }: ResumeStrengthMeterProps) => {
  const [score, setScore] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  
  React.useEffect(() => {
      let tempScore = 0;
      const tempSuggestions = [];

      // Basic Contact Info
      if (data.fullName) tempScore += 10;
      else tempSuggestions.push("Add your full name");

      if (data.email) tempScore += 10;
      else tempSuggestions.push("Add your email address");

      if (data.phone) tempScore += 5;
      
      // Content
      if (data.summary && data.summary.length > 50) tempScore += 15;
      else tempSuggestions.push("Add a professional summary (50+ characters)");

      if (data.experience && data.experience.length > 0) tempScore += 25;
      else tempSuggestions.push("Add at least one work experience");

      if (data.education && data.education.length > 0) tempScore += 15;
      else tempSuggestions.push("Add your education details");

      if (data.skills && data.skills.length >= 3) tempScore += 15;
      else tempSuggestions.push("Add at least 3 key skills");

      if (data.languages && data.languages.length > 0) tempScore += 5;
      
      setScore(Math.min(tempScore, 100));
      setSuggestions(tempSuggestions);

  }, [data]);

  const getColor = (s: number) => {
      if (s < 50) return "bg-red-500";
      if (s < 80) return "bg-yellow-500";
      return "bg-green-500";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between">
            Resume Strength
            <span className={score < 50 ? "text-red-500" : score < 80 ? "text-yellow-600" : "text-green-600"}>{score}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={score} className={`h-2 mb-4`} indicatorClassName={getColor(score)} />
        
        {suggestions.length > 0 && (
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold">Improve your score:</p>
                {suggestions.slice(0, 3).map((s, i) => ( // Show top 3 suggestions
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span>{s}</span>
                    </div>
                ))}
            </div>
        )}
        {score === 100 && (
             <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Your profile is optimized!</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};
