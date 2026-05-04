import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, RefreshCw, AlertTriangle, Wind, Moon, Coffee, Dumbbell } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';

interface QuestionOption { label: string; score: number }
interface Question { id: string; text: string; options: QuestionOption[] }

function getQuestions(lang: Language): Question[] {
  const qs: Record<Language, Question[]> = {
    en: [
      { id: 'sleep', text: 'How has your sleep quality been recently?', options: [
        { label: '😴 Excellent – 7–9 hrs, feel refreshed', score: 0 },
        { label: '😐 Average – 6–7 hrs, sometimes tired', score: 15 },
        { label: '😪 Poor – Under 6 hrs or broken sleep', score: 30 },
      ]},
      { id: 'stress', text: 'How would you describe your daily stress level?', options: [
        { label: '😊 Low – Mostly calm and relaxed', score: 0 },
        { label: '😬 Medium – Occasional tension', score: 15 },
        { label: '😤 High – Constantly overwhelmed', score: 30 },
      ]},
      { id: 'workload', text: 'How is your current workload?', options: [
        { label: '✅ Light – Manageable, time to rest', score: 0 },
        { label: '⚡ Moderate – Busy but coping', score: 10 },
        { label: '🔥 Heavy – Overwhelmed, no breaks', score: 25 },
      ]},
      { id: 'mood', text: 'How would you describe your mood lately?', options: [
        { label: '😄 Happy & positive', score: 0 },
        { label: '😑 Neutral – Neither great nor bad', score: 8 },
        { label: '😔 Sad or down often', score: 16 },
        { label: '😠 Irritated or anxious frequently', score: 20 },
      ]},
      { id: 'exercise', text: 'How often do you exercise or move your body?', options: [
        { label: '💪 Daily – Active lifestyle', score: 0 },
        { label: '🚶 Sometimes – A few times a week', score: 8 },
        { label: '🛋️ Rarely – Mostly sedentary', score: 15 },
      ]},
    ],
    hi: [
      { id: 'sleep', text: 'हाल ही में आपकी नींद की गुणवत्ता कैसी रही है?', options: [
        { label: '😴 बहुत अच्छी – 7–9 घंटे, तरोताजा महसूस करते हैं', score: 0 },
        { label: '😐 औसत – 6–7 घंटे, कभी-कभी थकान', score: 15 },
        { label: '😪 खराब – 6 घंटे से कम या टूटी हुई नींद', score: 30 },
      ]},
      { id: 'stress', text: 'आप अपने दैनिक तनाव स्तर को कैसे बताएंगे?', options: [
        { label: '😊 कम – ज्यादातर शांत और आरामदेह', score: 0 },
        { label: '😬 मध्यम – कभी-कभी तनाव', score: 15 },
        { label: '😤 अधिक – हमेशा अभिभूत', score: 30 },
      ]},
      { id: 'workload', text: 'आपका वर्तमान काम का बोझ कैसा है?', options: [
        { label: '✅ हल्का – संभालने योग्य, आराम का समय है', score: 0 },
        { label: '⚡ मध्यम – व्यस्त लेकिन संभाल रहे हैं', score: 10 },
        { label: '🔥 भारी – अभिभूत, कोई ब्रेक नहीं', score: 25 },
      ]},
      { id: 'mood', text: 'हाल ही में आपका मूड कैसा रहा है?', options: [
        { label: '😄 खुश और सकारात्मक', score: 0 },
        { label: '😑 तटस्थ – न अच्छा न बुरा', score: 8 },
        { label: '😔 अक्सर उदास या निराश', score: 16 },
        { label: '😠 अक्सर चिड़चिड़ा या चिंतित', score: 20 },
      ]},
      { id: 'exercise', text: 'आप कितनी बार व्यायाम या शारीरिक गतिविधि करते हैं?', options: [
        { label: '💪 रोज़ – सक्रिय जीवनशैली', score: 0 },
        { label: '🚶 कभी-कभी – सप्ताह में कुछ बार', score: 8 },
        { label: '🛋️ शायद ही कभी – ज्यादातर निष्क्रिय', score: 15 },
      ]},
    ],
    gu: [
      { id: 'sleep', text: 'તાજેતરમાં તમારી ઊंઘની ગુણવત્તા કેવી રહી છે?', options: [
        { label: '😴 ખૂબ સારી – 7–9 કલાક, તાજગી અનુભવો છો', score: 0 },
        { label: '😐 સામાન્ય – 6–7 કલાક, ક્યારેક થાક', score: 15 },
        { label: '😪 ખરાબ – 6 કલાકથી ઓછી અથવા ખંડિત ઊंઘ', score: 30 },
      ]},
      { id: 'stress', text: 'તમે તમારા દૈનિક તણાવ સ્તરને કેવી રીતે વર્ણવો છો?', options: [
        { label: '😊 ઓછો – મોટે ભાગે શાંત અને આરામદાયક', score: 0 },
        { label: '😬 મધ્યમ – ક્યારેક ક્યારેક તણાવ', score: 15 },
        { label: '😤 વધારે – સતત ભારે', score: 30 },
      ]},
      { id: 'workload', text: 'તમારો હાલનો કાર્યભાર કેવો છે?', options: [
        { label: '✅ હળવો – સંભાળી શકાય, આરામ માટે સમય', score: 0 },
        { label: '⚡ મધ્યમ – વ્યસ્ત પણ સામનો કરી રહ્યા', score: 10 },
        { label: '🔥 ભારે – ભારે, કોઈ વિરામ નહિ', score: 25 },
      ]},
      { id: 'mood', text: 'તાજેતરમાં તમારો મૂડ કેવો છે?', options: [
        { label: '😄 ખુશ અને સકારાત્મક', score: 0 },
        { label: '😑 તટસ્થ – ન સારું ન ખરાબ', score: 8 },
        { label: '😔 ઘણી વખત ઉદાસ', score: 16 },
        { label: '😠 ઘણી વખત ચીડ અથવા ચિંતિત', score: 20 },
      ]},
      { id: 'exercise', text: 'તમે કેટલી વખત વ્યાયામ કે શારીરિક ક્રિયા કરો છો?', options: [
        { label: '💪 રોજ – સક્રિય જીવનશૈલી', score: 0 },
        { label: '🚶 ક્યારેક ક્યારેક – અઠવાડિયામાં થોડી વાર', score: 8 },
        { label: '🛋️ ભાગ્યે જ – મોટે ભાગે નિષ્ક્રિય', score: 15 },
      ]},
    ],
  };
  return qs[lang] ?? qs['en'];
}

interface Suggestion { icon: React.ReactNode; title: string; desc: string }

function getSuggestions(level: 'Mild' | 'Moderate' | 'High', lang: Language): Suggestion[] {
  const data: Record<'Mild' | 'Moderate' | 'High', Record<Language, Suggestion[]>> = {
    Mild: {
      en: [
        { icon: <Dumbbell className="w-5 h-5" />, title: 'Keep Moving', desc: 'Maintain your exercise routine. Even a 20-min walk boosts mood and reduces cortisol.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Protect Your Sleep', desc: 'Keep a consistent sleep schedule — same bedtime and wake time even on weekends.' },
        { icon: <Wind className="w-5 h-5" />, title: 'Mindful Breathing', desc: 'Practice 5 minutes of deep breathing daily to keep your nervous system calm.' },
      ],
      hi: [
        { icon: <Dumbbell className="w-5 h-5" />, title: 'सक्रिय रहें', desc: 'व्यायाम जारी रखें। 20 मिनट की सैर भी मूड बेहतर करती है और कोर्टिसोल कम करती है।' },
        { icon: <Moon className="w-5 h-5" />, title: 'नींद की रक्षा करें', desc: 'नियमित सोने और जागने का समय बनाए रखें — सप्ताहांत में भी।' },
        { icon: <Wind className="w-5 h-5" />, title: 'सचेत श्वास', desc: 'तंत्रिका तंत्र को शांत रखने के लिए रोज़ 5 मिनट गहरी सांस लें।' },
      ],
      gu: [
        { icon: <Dumbbell className="w-5 h-5" />, title: 'સક્રિય રહો', desc: 'વ્યાયામ ચાલુ રાખો. 20 મિનિટ ચાલવું પણ મૂડ સુધારે છે અને કૉર્ટિસોલ ઘટાડે છે.' },
        { icon: <Moon className="w-5 h-5" />, title: 'ઊंઘ સુરક્ષિત કરો', desc: 'નિયમિત સૂવા-જાગવાનો સમય રાખો — સપ્તાહાંતમાં પણ.' },
        { icon: <Wind className="w-5 h-5" />, title: 'ધ્યાનપૂર્વક શ્વાસ', desc: 'ચેતાતંત્ર શાંત રાખવા રોજ 5 મિનિટ ઊंडો શ્વાસ લો.' },
      ],
    },
    Moderate: {
      en: [
        { icon: <Wind className="w-5 h-5" />, title: '4-7-8 Breathing', desc: 'Inhale 4s, hold 7s, exhale 8s. Repeat 4 times. Activates your parasympathetic system.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Improve Sleep Hygiene', desc: 'Avoid screens 1 hour before bed. Try chamomile tea or a warm shower before sleep.' },
        { icon: <Dumbbell className="w-5 h-5" />, title: 'Regular Exercise', desc: 'Aim for 30 mins of exercise 5x per week — yoga, walking, or gym all reduce stress hormones.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'Reduce Caffeine', desc: 'Limit coffee to 1–2 cups before noon. Caffeine raises cortisol and disrupts sleep cycles.' },
      ],
      hi: [
        { icon: <Wind className="w-5 h-5" />, title: '4-7-8 श्वास तकनीक', desc: '4 सेकंड सांस लें, 7 सेकंड रोकें, 8 सेकंड छोड़ें। 4 बार दोहराएं।' },
        { icon: <Moon className="w-5 h-5" />, title: 'नींद की आदतें सुधारें', desc: 'सोने से 1 घंटे पहले स्क्रीन से दूर रहें। कैमोमाइल चाय या गर्म स्नान आजमाएं।' },
        { icon: <Dumbbell className="w-5 h-5" />, title: 'नियमित व्यायाम', desc: 'सप्ताह में 5 बार 30 मिनट व्यायाम करें — योग, चलना या जिम।' },
        { icon: <Coffee className="w-5 h-5" />, title: 'कैफीन कम करें', desc: 'दोपहर से पहले 1–2 कप कॉफी तक सीमित रहें। कैफीन कोर्टिसोल बढ़ाता है।' },
      ],
      gu: [
        { icon: <Wind className="w-5 h-5" />, title: '4-7-8 શ્વાસ', desc: '4 સેકન્ડ શ્વાસ, 7 સેકન્ડ પકડો, 8 સેકન્ડ છોડો. 4 વખત કરો.' },
        { icon: <Moon className="w-5 h-5" />, title: 'ઊंઘ સુધારો', desc: 'સૂતા પહેલા 1 કલાક સ્ક્રીનથી દૂર રહો. ઊંઘ પહેલા ગરમ સ્નાન અજમાવો.' },
        { icon: <Dumbbell className="w-5 h-5" />, title: 'નિયમિત વ્યાયામ', desc: 'અઠવાડિયામાં 5 વખત 30 મિનિટ — યોગ, ચાલવું, અથવા જિમ.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'કૅફીન ઘટાડો', desc: 'બપોર પહેલા 1–2 કપ કૉફી સુધી મર્યાદિત રહો.' },
      ],
    },
    High: {
      en: [
        { icon: <Wind className="w-5 h-5" />, title: 'Box Breathing', desc: 'Inhale 4s → hold 4s → exhale 4s → hold 4s. Repeat 6 times. Used by Navy SEALs under stress.' },
        { icon: <Moon className="w-5 h-5" />, title: 'Prioritize Sleep', desc: 'High stress ruins sleep and poor sleep worsens stress. Treat 7–8 hrs as non-negotiable.' },
        { icon: <Brain className="w-5 h-5" />, title: 'Mindfulness Meditation', desc: 'Use free apps like Insight Timer for guided 10-min sessions. Even 1 week shows benefits.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'Cut Caffeine & Alcohol', desc: 'Both amplify anxiety and disrupt deep sleep. Replace with herbal teas and more water.' },
        { icon: <AlertTriangle className="w-5 h-5" />, title: 'Seek Professional Help', desc: 'Your stress level is high. Speaking with a therapist or counselor can make a big difference.' },
      ],
      hi: [
        { icon: <Wind className="w-5 h-5" />, title: 'बॉक्स ब्रीदिंग', desc: '4 सेकंड सांस → 4 सेकंड रोकें → 4 सेकंड छोड़ें → 4 सेकंड रोकें। 6 बार दोहराएं।' },
        { icon: <Moon className="w-5 h-5" />, title: 'नींद को प्राथमिकता दें', desc: 'उच्च तनाव नींद को बर्बाद करता है। 7–8 घंटे की नींद को गैर-परक्राम्य मानें।' },
        { icon: <Brain className="w-5 h-5" />, title: 'माइंडफुलनेस मेडिटेशन', desc: 'Insight Timer जैसे मुफ्त ऐप से 10 मिनट के सत्र करें। 1 सप्ताह में फर्क दिखेगा।' },
        { icon: <Coffee className="w-5 h-5" />, title: 'कैफीन और शराब बंद करें', desc: 'दोनों चिंता बढ़ाते हैं। हर्बल चाय और पानी से बदलें।' },
        { icon: <AlertTriangle className="w-5 h-5" />, title: 'पेशेवर मदद लें', desc: 'आपका तनाव स्तर उच्च है। किसी थेरेपिस्ट से बात करना बड़ा अंतर ला सकता है।' },
      ],
      gu: [
        { icon: <Wind className="w-5 h-5" />, title: 'બૉક્સ બ્રીધિંગ', desc: '4 સેક. શ્વાસ → 4 સેક. પકડો → 4 સેક. છોડો → 4 સેક. પકડો. 6 વખત.' },
        { icon: <Moon className="w-5 h-5" />, title: 'ઊंઘ ને પ્રાધાન્ય આપો', desc: 'ઊंચો તણાવ ઊंઘ બગાડે છે. 7–8 કલાક ઊंઘ ફરજિયાત ગણો.' },
        { icon: <Brain className="w-5 h-5" />, title: 'માઇન્ડફુલ ધ્યાન', desc: 'Insight Timer જેવા ફ્રી ઍપ્સ પર 10 મિ. સત્ર. 1 અઠવાડિયામાં ફરક દેખાય.' },
        { icon: <Coffee className="w-5 h-5" />, title: 'કૅફીન-દારૂ ઘટાડો', desc: 'બંને ચિંતા વધારે. હર્બલ ચા અને પાણીથી બદલો.' },
        { icon: <AlertTriangle className="w-5 h-5" />, title: 'વ્યાવસાયિક મદદ લો', desc: 'તમારો તણાવ ઊันচો છે. ચિકિત્સક સાથે વાત કરવી ઘણો ફર્ક પાડી શકે.' },
      ],
    },
  };
  return data[level]?.[lang] ?? data[level]?.['en'] ?? [];
}

interface StressResult { score: number; level: 'Mild' | 'Moderate' | 'High'; color: string; bgColor: string; levelKey: string }

function getResult(answers: Record<string, number>): StressResult {
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const score = Math.min(100, Math.round((total / 100) * 100));
  if (score <= 33) return { score, level: 'Mild', color: 'text-emerald-500', bgColor: 'bg-emerald-500', levelKey: 'Mild Stress' };
  if (score <= 66) return { score, level: 'Moderate', color: 'text-yellow-500', bgColor: 'bg-yellow-500', levelKey: 'Moderate Stress' };
  return { score, level: 'High', color: 'text-red-500', bgColor: 'bg-red-500', levelKey: 'High Stress' };
}

export default function StressAnalyzer() {
  const { language } = useAppState();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<StressResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const questions = getQuestions(language);
  const q = questions[current];
  const isLast = current === questions.length - 1;
  const progress = (current / questions.length) * 100;

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

  const reset = () => { setCurrent(0); setAnswers({}); setResult(null); setSelected(null); };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          {t('Stress Analyzer', language)}
        </h1>
        <p className="text-muted-foreground">{t('stress_subtitle', language)}</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 space-y-6">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{t('Question', language)} {current + 1} {t('of', language)} {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>

            <h2 className="text-xl font-display font-bold text-foreground">{q.text}</h2>

            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setSelected(i)} className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium ${selected === i ? 'border-primary bg-primary/5 text-foreground' : 'border-border hover:border-primary/40 hover:bg-secondary/50 text-foreground'}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <button onClick={handleNext} disabled={selected === null} className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-lg shadow-primary/25 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
              {isLast ? t('See My Results', language) : t('Next Question', language)}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50 text-center space-y-4">
              <p className="text-muted-foreground font-medium">{t('Your Stress Score', language)}</p>
              <div className={`text-7xl font-display font-bold ${result.color}`}>{result.score}</div>
              <div className={`inline-block px-6 py-2 rounded-full text-white font-bold ${result.bgColor}`}>{t(result.levelKey, language)}</div>
              <div className="w-full h-4 bg-secondary rounded-full overflow-hidden mt-4">
                <motion.div className={`h-4 rounded-full ${result.bgColor}`} initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{t('0 — Calm', language)}</span>
                <span>{t('100 — Burnout', language)}</span>
              </div>
              {result.level === 'High' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">{t('stress_high_warning', language)}</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50">
              <h3 className="font-display font-bold text-lg mb-5">{t('Coping Strategies for You', language)}</h3>
              <div className="space-y-4">
                {getSuggestions(result.level, language).map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">{s.icon}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{s.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={reset} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl border-2 border-border hover:border-primary/40 text-foreground font-semibold transition-all">
              <RefreshCw className="w-4 h-4" />
              {t('Take Again', language)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
