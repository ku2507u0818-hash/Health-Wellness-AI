import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { HeartPulse, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAnalyzeHealth } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';

export default function HealthCheck() {
  const [, setLocation] = useLocation();
  const { language } = useAppState();
  
  const [symptoms, setSymptoms] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [severity, setSeverity] = useState<'mild'|'moderate'|'severe'>('mild');
  const [age, setAge] = useState<number | ''>('');
  
  const analyzeMutation = useAnalyzeHealth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeMutation.mutate({
      data: {
        symptoms,
        lifestyle,
        severity,
        language,
        age: age ? Number(age) : null
      }
    });
  };

  if (analyzeMutation.isSuccess && analyzeMutation.data) {
    const report = analyzeMutation.data;
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center">
          <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Analysis Complete</h2>
          <p className="text-muted-foreground mb-6">Your ArogyaScore is {report.arogyaScore}</p>
          <button 
            onClick={() => setLocation(`/reports/${report.reportId}`)}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {t('View Full Report', language)}
          </button>
        </div>

        {/* Quick Preview of sections */}
        <div className="grid md:grid-cols-2 gap-4">
          <SectionCard 
            title="Symptom Analysis" 
            content={report.sections.symptomAnalysis} 
            colorClass="bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-100" 
          />
          <SectionCard 
            title="Wellness Suggestions" 
            content={report.sections.wellnessSuggestions} 
            colorClass="bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-100" 
          />
          <SectionCard 
            title="Warning Signs" 
            content={report.sections.warningSigns} 
            colorClass="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-100" 
          />
          <SectionCard 
            title="Medical Disclaimer" 
            content={report.sections.medicalDisclaimer} 
            colorClass="bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-200" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-primary" />
          {t('Analyze Health', language)}
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe what you're feeling and our AI will provide personalized insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            {t('Symptoms', language)} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
            placeholder="E.g., I've been having a slight headache and feeling tired since yesterday..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">{t('Lifestyle', language)} (Optional)</label>
          <textarea
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
            placeholder="E.g., I sleep 6 hours a day, exercise rarely, drink lots of coffee..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{t('Severity', language)}</label>
            <div className="relative">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                <option value="mild">{t('Mild', language)}</option>
                <option value="moderate">{t('Moderate', language)}</option>
                <option value="severe">{t('Severe', language)}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Age (Optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="e.g. 28"
            />
          </div>
        </div>

        {analyzeMutation.isError && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
            {analyzeMutation.error?.message || "Analysis failed. Please try again."}
          </div>
        )}

        <button
          type="submit"
          disabled={analyzeMutation.isPending || !symptoms.trim()}
          className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-lg font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-4"
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {t('Analyze Health', language)}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function SectionCard({ title, content, colorClass }: { title: string, content: string, colorClass: string }) {
  return (
    <div className={`p-5 rounded-2xl border ${colorClass}`}>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
