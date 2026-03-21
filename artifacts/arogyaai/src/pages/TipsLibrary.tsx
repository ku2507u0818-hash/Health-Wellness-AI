import React, { useState } from 'react';
import { Lightbulb, Loader2, Filter } from 'lucide-react';
import { useGetTips } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';

export default function TipsLibrary() {
  const { language } = useAppState();
  const [category, setCategory] = useState<string>('');
  
  const { data: tips, isLoading } = useGetTips({ category, language });

  const categories = [
    { value: '', label: 'All Tips' },
    { value: 'diet', label: 'Diet & Nutrition' },
    { value: 'exercise', label: 'Exercise' },
    { value: 'mental', label: 'Mental Health' },
    { value: 'sleep', label: 'Sleep' },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTipTitle = (tip: any, lang: Language) => {
    if (lang === 'hi') return tip.titleHi;
    if (lang === 'gu') return tip.titleGu;
    return tip.titleEn;
  };

  const getTipContent = (tip: any, lang: Language) => {
    if (lang === 'hi') return tip.contentHi;
    if (lang === 'gu') return tip.contentGu;
    return tip.contentEn;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-amber-500" />
            {t('Tips Library', language)}
          </h1>
          <p className="text-muted-foreground">Discover daily advice for a healthier life.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === c.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips?.map((tip) => (
          <div key={tip.id} className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: tip.icon || '💡' }} />
            </div>
            
            <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
              {tip.category}
            </div>
            
            <h3 className="text-xl font-display font-bold text-foreground mb-3 leading-snug">
              {getTipTitle(tip, language)}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              {getTipContent(tip, language)}
            </p>
          </div>
        ))}
      </div>
      
      {(!tips || tips.length === 0) && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No tips found for this category.</p>
        </div>
      )}
    </div>
  );
}
