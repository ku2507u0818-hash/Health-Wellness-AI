import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, RefreshCw, AlertTriangle, Wind, Moon, Coffee, Dumbbell } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: 'sleep',
    text: 'How has your sleep quality been recently?',
    options: [
      { label: '😴 Excellent – 7–9 hrs, feel refreshed', score: 0 },
      { label: '😐 Average – 6–7 hrs, sometimes tired', score: 15 },
      { label: '😪 Poor – Under 6 hrs or broken sleep', score: 30 },
    ],
  },
  {
    id: 'stress',
    text: 'How would you describe your daily stress level?',
    options: [
      { label: '😊 Low – Mostly calm and relaxed', score: 0 },
      { label: '😬 Medium – Occasional tension', score: 15 },
      { label: '😤 High – Constantly overwhelmed', score: 30 },
    ],
  },
  {
    id: 'workload',
    text: 'How is your current workload?',
    options: [
      { label: '✅ Light – Manageable, time to rest', score: 0 },
      { label: '⚡ Moderate – Busy but coping', score: 10 },
      { label: '🔥 Heavy – Overwhelmed, no breaks', score: 25 },
    ],
  },
  {
    id: 'mood',
    text: 'How would you describe your mood lately?',
    options: [
      { label: '😄 Happy & positive', score: 0 },
      { label: '😑 Neutral – Neither great nor bad', score: 8 },
      { label: '😔 Sad or down often', score: 16 },
      { label: '😠 Irritated or anxious frequently', score: 20 },
    ],
  },
  {
    id: 'exercise',
    text: 'How often do you exercise or move your body?',
    options: [
      { label: '💪 Daily – Active lifestyle', score: 0 },
      { label: '🚶 Sometimes – A few times a week', score: 8 },
      { label: '🛋️ Rarely – Mostly sedentary', score: 15 },
    ],
  },
];

interface StressResult {
  score: number;
  level: 'Mild' | 'Moderate' | 'High';
  color: string;
  bgColor: string;
  suggestions: { icon: React.ReactNode; title: string; desc: string }[];
}

function getResult(answers: Record<string, number>): StressResult {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxPossible = 100;
  const score = Math.min(100, Math.round((total / maxPossible) * 100));

  if (score <= 33) {
    return {
      score,
      level: 'Mild',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      suggestions: [
        { icon: <Dumbbell className="w-5 h-5" />, title: 'Keep Moving', desc: 'Maintain your exercise routine. Even a 20-min walk boosts mood and reduces cortisol.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Protect Your Sleep', desc: 'Keep a consistent sleep schedule — same bedtime and wake time even on weekends.' },
        { icon: <Wind className="w-5 h-5" />, title: 'Mindful Breathing', desc: 'Practice 5 minutes of deep breathing daily to keep your nervous system calm.' },
      ],
    };
  } else if (score <= 66) {
    return {
      score,
      level: 'Moderate',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      suggestions: [
        { icon: <Wind className="w-5 h-5" />, title: '4-7-8 Breathing', desc: 'Inhale 4s, hold 7s, exhale 8s. Repeat 4 times. This activates the parasympathetic system.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Improve Sleep Hygiene', desc: 'Avoid screens 1 hour before bed. Try chamomile tea or a warm shower before sleep.' },
        { icon: <Dumbbell className="w-5 h-5" />, title: 'Regular Physical Activity', desc: 'Aim for 30 mins of exercise 5x per week — yoga, walking, or gym all help reduce stress hormones.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'Reduce Caffeine', desc: 'Limit coffee to 1–2 cups before noon. Caffeine raises cortisol and disrupts sleep cycles.' },
      ],
    };
  } else {
    return {
      score,
      level: 'High',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      suggestions: [
        { icon: <Wind className="w-5 h-5" />, title: 'Box Breathing', desc: 'Inhale 4s → hold 4s → exhale 4s → hold 4s. Repeat 6 times. Used by Navy SEALs under stress.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Prioritize Sleep Above All', desc: 'High stress ruins sleep and poor sleep worsens stress. Treat 7–8 hrs of sleep as non-negotiable.' },
        { icon: <Brain className="w-5 h-5" />, title: 'Mindfulness Meditation', desc: 'Use free apps like Insight Timer for guided 10-min sessions. Even 1 week shows measurable benefits.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'Cut Caffeine & Alcohol', desc: 'Both amplify anxiety and disrupt deep sleep. Replace with herbal teas and more water.' },
        { icon: <AlertTriangle className="w-5 h-5" />, title: 'Seek Professional Help', desc: 'Your stress level is high. Speaking with a therapist or counselor can make a significant difference.' },
      ],
    };
  }
}

export default function StressAnalyzer() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<StressResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (score: number, idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const score = q.options[selected].score;
    const newAnswers = { ...answers, [q.id]: score };
    setAnswers(newAnswers);

    if (isLast) {
      setResult(getResult(newAnswers));
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setCurrent(0);
    setAnswers({});
    setResult(null);
    setSelected(null);
  };

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          Stress Analyzer
        </h1>
        <p className="text-muted-foreground">Answer 5 quick questions to assess your stress level and get personalized coping strategies.</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 space-y-6"
          >
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-2 bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-foreground">{q.text}</h2>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.score, i)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium ${
                    selected === i
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border hover:border-primary/40 hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLast ? 'See My Results' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 text-center space-y-4">
              <p className="text-muted-foreground font-medium">Your Stress Score</p>
              <div className={`text-7xl font-display font-bold ${result.color}`}>{result.score}</div>
              <div className={`inline-block px-6 py-2 rounded-full text-white font-bold ${result.bgColor}`}>
                {result.level} Stress
              </div>
              <div className="w-full h-4 bg-secondary rounded-full overflow-hidden mt-4">
                <motion.div
                  className={`h-4 rounded-full ${result.bgColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>0 — Calm</span>
                <span>100 — Burnout</span>
              </div>

              {result.level === 'High' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">Your stress level is high. Consider taking rest and speaking with a mental health professional for personalized support.</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
              <h3 className="font-display font-bold text-lg mb-5">Coping Strategies for You</h3>
              <div className="space-y-4">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{s.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border-2 border-border hover:border-primary/40 text-foreground font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Take Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
