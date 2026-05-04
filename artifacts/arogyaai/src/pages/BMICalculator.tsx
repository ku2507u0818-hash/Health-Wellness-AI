import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Calculator, TrendingUp, Info } from 'lucide-react';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bgColor: string;
  idealMin: number;
  idealMax: number;
  diff: number;
  tips: string[];
}

function calcBMI(height: number, weight: number, age: number | null, gender: string): BMIResult {
  const h = height / 100;
  const bmi = weight / (h * h);
  const rounded = Math.round(bmi * 10) / 10;

  let category = '';
  let color = '';
  let bgColor = '';
  let tips: string[] = [];

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-blue-500';
    bgColor = 'bg-blue-500';
    tips = [
      'Increase caloric intake with nutrient-dense foods like nuts, avocados, and whole grains.',
      'Add protein-rich foods: eggs, legumes, lean meat, and dairy.',
      'Do strength training exercises to build muscle mass.',
      'Eat 5–6 smaller meals throughout the day.',
      'Consult a nutritionist for a personalized weight-gain plan.',
    ];
  } else if (bmi < 25) {
    category = 'Normal Weight';
    color = 'text-emerald-500';
    bgColor = 'bg-emerald-500';
    tips = [
      'Great work! Maintain your current balanced diet and activity level.',
      'Aim for 150+ minutes of moderate exercise per week.',
      'Stay hydrated — 8 glasses of water daily.',
      'Keep a consistent sleep schedule of 7–8 hours.',
      'Have regular health check-ups to monitor your wellbeing.',
    ];
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-500';
    tips = [
      'Reduce processed foods, sugar, and refined carbohydrates.',
      'Incorporate 30 minutes of moderate cardio daily (walking, cycling, swimming).',
      'Practice portion control and mindful eating.',
      'Increase fiber intake with vegetables, fruits, and whole grains.',
      'Track your food intake to build awareness of eating patterns.',
    ];
  } else {
    category = 'Obese';
    color = 'text-red-500';
    bgColor = 'bg-red-500';
    tips = [
      'Consult your doctor before starting any weight-loss program.',
      'Start with low-impact exercise like walking or swimming to protect joints.',
      'Focus on whole foods — eliminate ultra-processed and sugary drinks.',
      'Set small, achievable goals (0.5–1 kg loss per week).',
      'Consider working with a registered dietitian for a structured plan.',
    ];
  }

  const idealMin = Math.round(18.5 * h * h * 10) / 10;
  const idealMax = Math.round(24.9 * h * h * 10) / 10;
  const midIdeal = (idealMin + idealMax) / 2;
  const diff = Math.round((weight - midIdeal) * 10) / 10;

  return { bmi: rounded, category, color, bgColor, idealMin, idealMax, diff, tips };
}

function GaugeMeter({ bmi, bgColor }: { bmi: number; bgColor: string }) {
  const clamp = Math.min(Math.max(bmi, 10), 40);
  const pct = (clamp - 10) / 30;
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <svg viewBox="0 0 160 90" className="w-48 mx-auto">
      <path
        d={`M 10 80 A ${radius} ${radius} 0 0 1 150 80`}
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        className="text-border"
        strokeLinecap="round"
      />
      <path
        d={`M 10 80 A ${radius} ${radius} 0 0 1 150 80`}
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        className={bgColor.replace('bg-', 'text-')}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="80" y="72" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="bold">
        {bmi}
      </text>
    </svg>
  );
}

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h < 50 || h > 250 || w < 10 || w > 500) return;
    setResult(calcBMI(h, w, age ? parseInt(age) : null, gender));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <Scale className="w-8 h-8 text-primary" />
          BMI Calculator
        </h1>
        <p className="text-muted-foreground">Calculate your Body Mass Index and get personalized health insights.</p>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Height (cm) *</label>
              <input
                type="number"
                required
                min={50}
                max={250}
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g. 170"
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Weight (kg) *</label>
              <input
                type="number"
                required
                min={10}
                max={500}
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 65"
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Age (optional)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Gender (optional)</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            <Calculator className="w-5 h-5" />
            Calculate BMI
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 text-center">
              <GaugeMeter bmi={result.bmi} bgColor={result.bgColor} />
              <div className={`text-2xl font-display font-bold mt-2 ${result.color}`}>{result.category}</div>
              <p className="text-muted-foreground mt-1">BMI: <span className="font-bold text-foreground">{result.bmi}</span></p>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Ideal Range</p>
                  <p className="font-bold text-foreground mt-1">{result.idealMin}–{result.idealMax} kg</p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Your BMI</p>
                  <p className={`font-bold mt-1 ${result.color}`}>{result.bmi}</p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">{result.diff > 0 ? 'Above Ideal' : result.diff < 0 ? 'Below Ideal' : 'At Ideal'}</p>
                  <p className="font-bold text-foreground mt-1">
                    {result.diff === 0 ? '✓' : `${Math.abs(result.diff)} kg`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Personalized Health Tips
              </h3>
              <ul className="space-y-3">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">BMI is a general indicator and does not account for muscle mass, bone density, or other individual factors. Consult a healthcare professional for a comprehensive health assessment.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
