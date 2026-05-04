import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Calculator, TrendingUp, Info } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';

interface BMIResult {
  bmi: number;
  categoryKey: string;
  color: string;
  bgColor: string;
  idealMin: number;
  idealMax: number;
  diff: number;
  tipsKeys: string[][];
}

function getTips(categoryKey: string, lang: Language): string[] {
  const tips: Record<string, Record<Language, string[]>> = {
    Underweight: {
      en: [
        'Increase caloric intake with nutrient-dense foods like nuts, avocados, and whole grains.',
        'Add protein-rich foods: eggs, legumes, lean meat, and dairy.',
        'Do strength training exercises to build muscle mass.',
        'Eat 5–6 smaller meals throughout the day.',
        'Consult a nutritionist for a personalized weight-gain plan.',
      ],
      hi: [
        'बादाम, एवोकाडो और साबुत अनाज जैसे पोषक खाद्य पदार्थों से कैलोरी बढ़ाएं।',
        'प्रोटीन युक्त आहार लें: अंडे, दालें, लीन मीट और डेयरी।',
        'मांसपेशियां बनाने के लिए स्ट्रेंथ ट्रेनिंग करें।',
        'दिन में 5–6 छोटे भोजन करें।',
        'व्यक्तिगत वजन बढ़ाने की योजना के लिए पोषण विशेषज्ञ से सलाह लें।',
      ],
      gu: [
        'બદામ, એવોકાડો અને આખા અનાજ જેવા પોષક ખોરાકથી કૅલરી વધારો.',
        'પ્રોટીન ભરપૂર ખોરાક લો: ઇંડા, કઠોળ, દૂધ અને ડેરી.',
        'સ્નાયુ બનાવવા સ્ટ્રેન્થ ટ્રેઇનિંગ કરો.',
        'દિવસમાં 5–6 નાના ભોજન ખાઓ.',
        'વ્યક્તિગત વજન વધારવાની યોજના માટે ન્યૂટ્રિશ્નિસ્ટ સાથે સલાહ કરો.',
      ],
    },
    'Normal Weight': {
      en: [
        'Great work! Maintain your current balanced diet and activity level.',
        'Aim for 150+ minutes of moderate exercise per week.',
        'Stay hydrated — 8 glasses of water daily.',
        'Keep a consistent sleep schedule of 7–8 hours.',
        'Have regular health check-ups to monitor your wellbeing.',
      ],
      hi: [
        'बहुत अच्छे! अपने वर्तमान संतुलित आहार और गतिविधि को बनाए रखें।',
        'प्रति सप्ताह 150+ मिनट मध्यम व्यायाम का लक्ष्य रखें।',
        'हाइड्रेटेड रहें — प्रतिदिन 8 गिलास पानी।',
        '7–8 घंटे की नियमित नींद बनाए रखें।',
        'नियमित स्वास्थ्य जांच कराएं।',
      ],
      gu: [
        'સરસ! તમારો હાલનો સંતુલિત આહાર અને ગતિવિધિ જાળવી રાખો.',
        'દર અઠવાડિયે 150+ મિનિટ મધ્યમ કસરત કરો.',
        'હાઇડ્રેટ રહો — દરરોજ 8 ગ્લાસ પાણી.',
        '7–8 કલાક નિયમિત ઊંઘ રાખો.',
        'નિયમિત આરોગ્ય તપાસ કરાવો.',
      ],
    },
    Overweight: {
      en: [
        'Reduce processed foods, sugar, and refined carbohydrates.',
        'Incorporate 30 minutes of moderate cardio daily (walking, cycling, swimming).',
        'Practice portion control and mindful eating.',
        'Increase fiber intake with vegetables, fruits, and whole grains.',
        'Track your food intake to build awareness of eating patterns.',
      ],
      hi: [
        'प्रोसेस्ड फूड, चीनी और रिफाइंड कार्बोहाइड्रेट कम करें।',
        'रोजाना 30 मिनट मध्यम कार्डियो (चलना, साइकलिंग, तैराकी) करें।',
        'भाग नियंत्रण और सचेत भोजन का अभ्यास करें।',
        'सब्जियों, फलों और साबुत अनाज से फाइबर बढ़ाएं।',
        'खाने की आदतों की जागरूकता के लिए खाद्य सेवन ट्रैक करें।',
      ],
      gu: [
        'પ્રોસેસ્ડ ફૂડ, ખાંડ અને રિફાઇન્ડ કાર્બોહાઇડ્રેટ ઘટાડો.',
        'રોજ 30 મિનિટ મધ્યમ કાર્ડિઓ (ચાલવું, સાઇક્લિંગ, તરવું) કરો.',
        'ભોજનનો ભાગ નિયંત્રણ અને સ્ વ-ઇચ્છિત ભોજન રાખો.',
        'શાકભાજી, ફળ અને આખા અનાજ દ્વારા ફાઇબર વધારો.',
        'ભોજન ટ્રૅક કરો.',
      ],
    },
    Obese: {
      en: [
        'Consult your doctor before starting any weight-loss program.',
        'Start with low-impact exercise like walking or swimming to protect joints.',
        'Focus on whole foods — eliminate ultra-processed and sugary drinks.',
        'Set small, achievable goals (0.5–1 kg loss per week).',
        'Consider working with a registered dietitian for a structured plan.',
      ],
      hi: [
        'कोई भी वजन घटाने का कार्यक्रम शुरू करने से पहले डॉक्टर से परामर्श लें।',
        'जोड़ों की सुरक्षा के लिए चलने या तैराकी जैसे कम प्रभाव वाले व्यायाम से शुरू करें।',
        'संपूर्ण आहार पर ध्यान दें — अल्ट्रा-प्रोसेस्ड और मीठे पेय हटाएं।',
        'छोटे, प्राप्त करने योग्य लक्ष्य निर्धारित करें (प्रति सप्ताह 0.5–1 किग्रा)।',
        'व्यवस्थित योजना के लिए पंजीकृत आहार विशेषज्ञ के साथ काम करने पर विचार करें।',
      ],
      gu: [
        'કોઈ પણ વજન ઘટાડવાનો કાર્યક્રમ શરૂ કરતા પહેલા ડૉક્ટરની સલાહ લો.',
        'સાંધા બચાવવા ચાલવા અથવા તરવા જેવી ઓછી-અસરની કસરતથી શરૂ કરો.',
        'આખા ખોરાક પર ધ્યાન આપો — ઉચ્ચ-પ્રક્રિયા અને ખાંડ મીઠા પીણા દૂર કરો.',
        'નાના, પ્રાપ્ત કરી શકાય તેવા ધ્યેયો નક્કી કરો (દર અઠવાડિયે 0.5–1 કિ.ગ્રા.).',
        'માળખાકીય યોજના માટે નોંધાયેલ આહારતજ્ઞ સાથે કામ કરવાનો વિચાર કરો.',
      ],
    },
  };
  return tips[categoryKey]?.[lang] ?? tips[categoryKey]?.['en'] ?? [];
}

function calcBMI(height: number, weight: number): BMIResult {
  const h = height / 100;
  const bmi = weight / (h * h);
  const rounded = Math.round(bmi * 10) / 10;

  let categoryKey = '';
  let color = '';
  let bgColor = '';

  if (bmi < 18.5) {
    categoryKey = 'Underweight'; color = 'text-blue-500'; bgColor = 'bg-blue-500';
  } else if (bmi < 25) {
    categoryKey = 'Normal Weight'; color = 'text-emerald-500'; bgColor = 'bg-emerald-500';
  } else if (bmi < 30) {
    categoryKey = 'Overweight'; color = 'text-yellow-500'; bgColor = 'bg-yellow-500';
  } else {
    categoryKey = 'Obese'; color = 'text-red-500'; bgColor = 'bg-red-500';
  }

  const idealMin = Math.round(18.5 * h * h * 10) / 10;
  const idealMax = Math.round(24.9 * h * h * 10) / 10;
  const midIdeal = (idealMin + idealMax) / 2;
  const diff = Math.round((weight - midIdeal) * 10) / 10;

  return { bmi: rounded, categoryKey, color, bgColor, idealMin, idealMax, diff, tipsKeys: [] };
}

function GaugeMeter({ bmi, bgColor }: { bmi: number; bgColor: string }) {
  const clamp = Math.min(Math.max(bmi, 10), 40);
  const pct = (clamp - 10) / 30;
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <svg viewBox="0 0 160 90" className="w-48 mx-auto">
      <path d={`M 10 80 A ${radius} ${radius} 0 0 1 150 80`} fill="none" stroke="currentColor" strokeWidth="12" className="text-border" strokeLinecap="round" />
      <path d={`M 10 80 A ${radius} ${radius} 0 0 1 150 80`} fill="none" stroke="currentColor" strokeWidth="12" className={bgColor.replace('bg-', 'text-')} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="80" y="72" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="bold">{bmi}</text>
    </svg>
  );
}

export default function BMICalculator() {
  const { language } = useAppState();
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
    setResult(calcBMI(h, w));
  };

  const diffLabel = result
    ? result.diff > 0 ? t('Above Ideal', language) : result.diff < 0 ? t('Below Ideal', language) : t('At Ideal', language)
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <Scale className="w-8 h-8 text-primary" />
          {t('BMI Calculator', language)}
        </h1>
        <p className="text-muted-foreground">{t('bmi_subtitle', language)}</p>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('Height (cm)', language)}</label>
              <input type="number" required min={50} max={250} value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('Weight (kg)', language)}</label>
              <input type="number" required min={10} max={500} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65" className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('Age (optional)', language)}</label>
              <input type="number" min={1} max={120} value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 25" className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('Gender (optional)', language)}</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer">
                <option value="">{t('Select gender', language)}</option>
                <option value="male">{t('Male', language)}</option>
                <option value="female">{t('Female', language)}</option>
                <option value="other">{t('Other / Prefer not to say', language)}</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
            <Calculator className="w-5 h-5" />
            {t('Calculate BMI', language)}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 text-center">
              <GaugeMeter bmi={result.bmi} bgColor={result.bgColor} />
              <div className={`text-2xl font-display font-bold mt-2 ${result.color}`}>{t(result.categoryKey, language)}</div>
              <p className="text-muted-foreground mt-1">{t('Your BMI', language)}: <span className="font-bold text-foreground">{result.bmi}</span></p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">{t('Ideal Range', language)}</p>
                  <p className="font-bold text-foreground mt-1">{result.idealMin}–{result.idealMax} kg</p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">{t('Your BMI', language)}</p>
                  <p className={`font-bold mt-1 ${result.color}`}>{result.bmi}</p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">{diffLabel}</p>
                  <p className="font-bold text-foreground mt-1">{result.diff === 0 ? '✓' : `${Math.abs(result.diff)} kg`}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t('Personalized Health Tips', language)}
              </h3>
              <ul className="space-y-3">
                {getTips(result.categoryKey, language).map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">{t('bmi_disclaimer', language)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
