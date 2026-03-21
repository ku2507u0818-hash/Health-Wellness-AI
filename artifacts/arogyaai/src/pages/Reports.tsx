import React from 'react';
import { Link } from 'wouter';
import { FileText, ChevronRight, Loader2, Calendar } from 'lucide-react';
import { useGetReports } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { t } from '@/lib/i18n';

export default function Reports() {
  const { language } = useAppState();
  const { data: reports, isLoading } = useGetReports();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            {t('Reports', language)}
          </h1>
          <p className="text-muted-foreground">Your complete health analysis history</p>
        </div>
        <Link href="/health-check">
          <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform w-fit">
            New Analysis
          </button>
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">No reports yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Take a health check to generate your first AI wellness report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer group flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl
                    ${report.arogyaScore >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-500/20' : 
                      report.arogyaScore >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20' : 
                      'bg-red-100 text-red-700 dark:bg-red-500/20'}
                  `}>
                    {report.arogyaScore}
                  </div>
                  <span className={`
                    px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full
                    ${report.severity === 'mild' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                      report.severity === 'moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 
                      'bg-red-100 text-red-700 dark:bg-red-900/30'}
                  `}>
                    {report.severity}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1">
                  {report.symptoms}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    View <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
