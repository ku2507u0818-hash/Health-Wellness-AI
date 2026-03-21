import React from 'react';
import { useLocation, useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { Activity, Check } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import type { Language } from '../lib/i18n';

const languages = [
  {
    code: 'en' as Language,
    name: 'English',
    native: 'English',
    greeting: 'Welcome to ArogyaAI',
    sub: 'Your AI Health & Wellness Companion',
    flag: '🇬🇧',
  },
  {
    code: 'hi' as Language,
    name: 'Hindi',
    native: 'हिंदी',
    greeting: 'ArogyaAI में आपका स्वागत है',
    sub: 'आपका AI स्वास्थ्य सहायक',
    flag: '🇮🇳',
  },
  {
    code: 'gu' as Language,
    name: 'Gujarati',
    native: 'ગુજરાતી',
    greeting: 'ArogyaAI માં આપનું સ્વાગત છે',
    sub: 'તમારો AI સ્વાસ્થ્ય સહાયક',
    flag: '🇮🇳',
  },
];

const continueLabel: Record<Language, string> = {
  en: 'Continue',
  hi: 'आगे बढ़ें',
  gu: 'આગળ વધો',
};

const chooseLabel: Record<Language, string> = {
  en: 'Choose your language',
  hi: 'अपनी भाषा चुनें',
  gu: 'તમારી ભાષા પસંદ કરો',
};

const subLabel: Record<Language, string> = {
  en: 'Select the language you are most comfortable with',
  hi: 'वह भाषा चुनें जिसमें आप सबसे सहज हों',
  gu: 'તે ભાષા પસંદ કરો જેમાં તમે સૌથી સહજ છો',
};

const skipLabel: Record<Language, string> = {
  en: 'Skip and continue in English',
  hi: 'छोड़ें और अंग्रेजी में जारी रखें',
  gu: 'છોડો અને અંગ્રેજીમાં ચાલુ રાખો',
};

export default function LanguagePicker() {
  const { language, setLanguage } = useAppState();
  const [, setLocation] = useLocation();
  const search = useSearch();

  const params = new URLSearchParams(search);
  const destination = params.get('next') || '/signup';

  const selected = languages.find((l) => l.code === language) || languages[0];

  function handleContinue() {
    setLocation(destination);
  }

  function handleSkip() {
    setLanguage('en');
    setLocation(destination);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground tracking-tight">ArogyaAI</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-2">
            {chooseLabel[language]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {subLabel[language]}
          </p>
        </div>

        {/* Language Cards */}
        <div className="flex flex-col gap-3 mb-6">
          {languages.map((l, i) => (
            <motion.button
              key={l.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setLanguage(l.code)}
              aria-label={`Select ${l.name}`}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 w-full text-left transition-all duration-200 ${
                language === l.code
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-card/80'
              }`}
            >
              {/* Flag circle */}
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-2xl shrink-0">
                {l.flag}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-semibold text-base text-foreground">{l.native}</span>
                  <span className="text-xs text-muted-foreground font-normal">{l.name}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-0.5 truncate">{l.greeting}</div>
              </div>

              {/* Check */}
              {language === l.code && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Preview card */}
        <div className="p-4 rounded-xl bg-card border border-border text-center mb-6">
          <div className="text-sm font-semibold text-foreground mb-1">{selected.greeting}</div>
          <div className="text-xs text-muted-foreground">{selected.sub}</div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 mb-3"
        >
          {continueLabel[language]} →
        </button>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 bg-transparent border-none cursor-pointer py-1"
        >
          {skipLabel[language]}
        </button>
      </motion.div>
    </div>
  );
}
