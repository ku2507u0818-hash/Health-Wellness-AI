import React from 'react';
import { Link } from 'wouter';
import { Activity, Flame, FileText, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
import { useGetDashboard } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';
import { ArogyaScore } from '@/components/ArogyaScore';

function getTipTitle(tip: any, lang: Language) {
  if (lang === 'hi') return tip.titleHi;
  if (lang === 'gu') return tip.titleGu;
  return tip.titleEn;
}

export default function Dashboard() {
  const { language } = useAppState();
  const { data, isLoading, error } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-center">
        Failed to load dashboard. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-emerald-500 rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
            <h2 className="font-display font-bold text-3xl sm:text-4xl">{t('Dashboard', language)}</h2>
            <p className="text-primary-foreground/80 text-lg">
              Take a new health check to update your ArogyaScore and keep your health streak alive!
            </p>
            <Link href="/health-check">
              <button className="mt-4 px-6 py-3 bg-background text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                {t('Analyze Health', language)}
              </button>
            </Link>
          </div>

          <div className="relative z-10 bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
            <ArogyaScore score={data.arogyaScore} size={160} strokeWidth={12} />
          </div>
        </div>

        {/* Mini Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg shadow-black/5 flex items-center gap-6 hover:border-primary/30 transition-colors flex-1">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">{t('Health Streak', language)}</p>
              <p className="font-display font-bold text-3xl text-foreground">{data.healthStreak} <span className="text-lg font-medium text-muted-foreground">days</span></p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg shadow-black/5 flex items-center gap-6 hover:border-primary/30 transition-colors flex-1">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">{t('Total Reports', language)}</p>
              <p className="font-display font-bold text-3xl text-foreground">{data.totalReports}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-display font-bold text-xl">{t('Recent Reports', language)}</h3>
            <Link href="/reports">
              <span className="text-primary font-medium hover:underline cursor-pointer flex items-center gap-1 text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div className="space-y-3">
            {data.recentReports.length > 0 ? data.recentReports.map(report => (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                      {report.arogyaScore}
                    </div>
                    <div>
                      <p className="font-bold text-foreground capitalize">{report.severity} Issue</p>
                      <p className="text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center bg-card rounded-2xl border border-dashed border-border text-muted-foreground">
                No reports yet. Start by taking a health check!
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-display font-bold text-xl">{t('Quick Tips', language)}</h3>
            <Link href="/tips">
              <span className="text-primary font-medium hover:underline cursor-pointer flex items-center gap-1 text-sm">
                More tips <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid gap-3">
            {data.recentTips.length > 0 ? data.recentTips.slice(0, 3).map(tip => (
              <div key={tip.id} className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 shrink-0">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{getTipTitle(tip, language)}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {language === 'hi' ? tip.contentHi : language === 'gu' ? tip.contentGu : tip.contentEn}
                  </p>
                </div>
              </div>
            )) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
