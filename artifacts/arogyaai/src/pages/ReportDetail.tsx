import React from 'react';
import { useRoute, Link } from 'wouter';
import { Loader2, ArrowLeft, Printer, AlertTriangle, Info, ShieldAlert, Heart, Activity } from 'lucide-react';
import { useGetReport } from '@workspace/api-client-react';
import { ArogyaScore } from '@/components/ArogyaScore';

export default function ReportDetail() {
  const [, params] = useRoute('/reports/:id');
  const id = Number(params?.id);
  const { data: report, isLoading, error } = useGetReport(id);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center">
        Report not found.
      </div>
    );
  }

  // Parse sections safely. The API might return sections as stringified JSON depending on implementation, 
  // or actual object. We handle both just in case.
  let sections: Record<string, string> = {};
  try {
    const rawAnalysis = typeof report.analysis === 'string' && report.analysis.startsWith('{') 
      ? JSON.parse(report.analysis) 
      : report.analysis;
      
    if (rawAnalysis.sections) {
      sections = rawAnalysis.sections;
    } else {
      // Fallback if not beautifully sectioned
      sections = { 'Full Analysis': String(report.analysis) };
    }
  } catch (e) {
    sections = { 'Analysis': report.analysis };
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print-full">
      <div className="flex items-center justify-between no-print mb-6">
        <Link href="/reports">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Reports
          </button>
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium transition-colors"
        >
          <Printer className="w-4 h-4" /> Print PDF
        </button>
      </div>

      <div className="bg-card rounded-3xl p-8 border border-border shadow-xl shadow-black/5 print-full print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/50 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full
                ${report.severity === 'mild' ? 'bg-green-100 text-green-700' : 
                  report.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 
                  'bg-red-100 text-red-700'}
              `}>
                {report.severity} Severity
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-3">
              Health Analysis Report
            </h1>
          </div>
          <div className="shrink-0 print-break-inside-avoid">
            <ArogyaScore score={report.arogyaScore} size={100} strokeWidth={8} />
          </div>
        </div>

        {/* Inputs Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 print-break-inside-avoid">
          <div className="bg-muted/50 rounded-2xl p-5 border border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Reported Symptoms
            </h3>
            <p className="font-medium">{report.symptoms}</p>
          </div>
          {report.lifestyle && (
            <div className="bg-muted/50 rounded-2xl p-5 border border-border/50">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Lifestyle Context
              </h3>
              <p className="font-medium">{report.lifestyle}</p>
            </div>
          )}
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-6">
          {sections.symptomAnalysis && (
            <Section 
              title="Symptom Analysis" 
              icon={<Info className="w-5 h-5" />}
              content={sections.symptomAnalysis} 
              colorClass="bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-200" 
            />
          )}
          {sections.wellnessSuggestions && (
            <Section 
              title="Wellness Suggestions" 
              icon={<Heart className="w-5 h-5" />}
              content={sections.wellnessSuggestions} 
              colorClass="bg-green-50 border-green-200 text-green-900 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-200" 
            />
          )}
          {sections.dietLifestyle && (
            <Section 
              title="Diet & Lifestyle" 
              icon={<Activity className="w-5 h-5" />}
              content={sections.dietLifestyle} 
              colorClass="bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-200" 
            />
          )}
          {sections.sleepStress && (
            <Section 
              title="Sleep & Stress" 
              icon={<AlertTriangle className="w-5 h-5" />}
              content={sections.sleepStress} 
              colorClass="bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/20 dark:border-purple-900/40 dark:text-purple-200" 
            />
          )}
          {sections.warningSigns && (
            <Section 
              title="Warning Signs" 
              icon={<ShieldAlert className="w-5 h-5" />}
              content={sections.warningSigns} 
              colorClass="bg-red-50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-200" 
            />
          )}
          {sections.medicalDisclaimer && (
            <Section 
              title="Medical Disclaimer" 
              icon={<Info className="w-5 h-5" />}
              content={sections.medicalDisclaimer} 
              colorClass="bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-300" 
            />
          )}

          {/* Fallback rendering if sections are just standard map */}
          {Object.entries(sections).map(([key, val]) => {
            if (['symptomAnalysis', 'wellnessSuggestions', 'dietLifestyle', 'sleepStress', 'warningSigns', 'medicalDisclaimer'].includes(key)) return null;
            return (
              <Section 
                key={key}
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                content={val}
                colorClass="bg-muted border-border text-foreground"
              />
            )
          })}
        </div>
      </div>
    </div>
  );
}

function Section({ title, content, colorClass, icon }: { title: string, content: string, colorClass: string, icon?: React.ReactNode }) {
  if (!content || content === 'N/A') return null;
  return (
    <div className={`p-6 rounded-2xl border ${colorClass} print-break-inside-avoid print:border-b print:bg-transparent print:text-black`}>
      <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="opacity-90 leading-relaxed whitespace-pre-wrap text-[15px]">{content}</div>
    </div>
  );
}
