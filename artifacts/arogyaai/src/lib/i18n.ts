export type Language = 'en' | 'hi' | 'gu';

const dictionary: Record<string, Record<Language, string>> = {
  // Existing
  'Dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', gu: 'ડેશબોર્ડ' },
  'Health Check': { en: 'Health Check', hi: 'स्वास्थ्य जाँच', gu: 'આરોગ્ય તપાસ' },
  'Reports': { en: 'Reports', hi: 'रिपोर्ट', gu: 'અહેવાલો' },
  'Tips Library': { en: 'Tips Library', hi: 'टिप्स लाइब्रेरी', gu: 'ટિપ્સ લાઇબ્રેરી' },
  'Profile': { en: 'Profile', hi: 'प्रोफाइल', gu: 'પ્રોફાઇલ' },
  'Logout': { en: 'Logout', hi: 'लॉग आउट', gu: 'લૉગ આઉટ' },
  'ArogyaScore': { en: 'ArogyaScore', hi: 'आरोग्य स्कोर', gu: 'આરોગ્ય સ્કોર' },
  'Health Streak': { en: 'Health Streak', hi: 'हेल्थ स्ट्रीक', gu: 'હેલ્થ સ્ટ્રીક' },
  'Total Reports': { en: 'Total Reports', hi: 'कुल रिपोर्ट', gu: 'કુલ અહેવાલો' },
  'Recent Reports': { en: 'Recent Reports', hi: 'हाल की रिपोर्ट', gu: 'તાજેતરના અહેવાલો' },
  'Quick Tips': { en: 'Quick Tips', hi: 'त्वरित टिप्स', gu: 'ઝડપી ટિપ્સ' },
  'Analyze Health': { en: 'Analyze Health', hi: 'स्वास्थ्य का विश्लेषण करें', gu: 'આરોગ્યનું વિશ્લેષણ કરો' },
  'Symptoms': { en: 'Symptoms', hi: 'लक्षण', gu: 'લક્ષણો' },
  'Lifestyle': { en: 'Lifestyle', hi: 'जीवन शैली', gu: 'જીવનશૈલી' },
  'Severity': { en: 'Severity', hi: 'गंभीरता', gu: 'ગંભીરતા' },
  'Mild': { en: 'Mild', hi: 'हल्का', gu: 'હળવા' },
  'Moderate': { en: 'Moderate', hi: 'मध्यम', gu: 'મધ્યમ' },
  'Severe': { en: 'Severe', hi: 'गंभीर', gu: 'ગંભીર' },
  'Language': { en: 'Language', hi: 'भाषा', gu: 'ભાષા' },
  'Submit': { en: 'Submit', hi: 'जमा करें', gu: 'સબમિટ કરો' },
  'Loading...': { en: 'Loading...', hi: 'लोड हो रहा है...', gu: 'લોડ થઈ રહ્યું છે...' },
  'View Full Report': { en: 'View Full Report', hi: 'पूरी रिपोर्ट देखें', gu: 'સંપૂર્ણ અહેવાલ જુઓ' },

  // BMI Calculator
  'BMI Calculator': { en: 'BMI Calculator', hi: 'बीएमआई कैलकुलेटर', gu: 'BMI કેલ્ક્યુલેટર' },
  'bmi_subtitle': {
    en: 'Calculate your Body Mass Index and get personalized health insights.',
    hi: 'अपना बॉडी मास इंडेक्स कैलकुलेट करें और व्यक्तिगत स्वास्थ्य सुझाव पाएं।',
    gu: 'તમારો બૉડી માસ ઇન્ડેક્સ ગણો અને વ્યક્તિગત સ્વાસ્થ્ય સૂઝ મેળવો.',
  },
  'Height (cm)': { en: 'Height (cm) *', hi: 'ऊंचाई (सेमी) *', gu: 'ઊંચાઈ (સેમી) *' },
  'Weight (kg)': { en: 'Weight (kg) *', hi: 'वजन (किलोग्राम) *', gu: 'વજન (કિ.ગ્રા.) *' },
  'Age (optional)': { en: 'Age (optional)', hi: 'आयु (वैकल्पिक)', gu: 'ઉંમર (વૈકલ્પિક)' },
  'Gender (optional)': { en: 'Gender (optional)', hi: 'लिंग (वैकल्पिक)', gu: 'જાતિ (વૈકલ્પિક)' },
  'Select gender': { en: 'Select gender', hi: 'लिंग चुनें', gu: 'જાતિ પસંદ કરો' },
  'Male': { en: 'Male', hi: 'पुरुष', gu: 'પુરુષ' },
  'Female': { en: 'Female', hi: 'महिला', gu: 'સ્ત્રી' },
  'Other / Prefer not to say': { en: 'Other / Prefer not to say', hi: 'अन्य / बताना नहीं चाहते', gu: 'અન્ય / કહેવું નથી' },
  'Calculate BMI': { en: 'Calculate BMI', hi: 'बीएमआई की गणना करें', gu: 'BMI ગણો' },
  'Underweight': { en: 'Underweight', hi: 'कम वजन', gu: 'ઓછું વજન' },
  'Normal Weight': { en: 'Normal Weight', hi: 'सामान्य वजन', gu: 'સામાન્ય વજન' },
  'Overweight': { en: 'Overweight', hi: 'अधिक वजन', gu: 'વધુ વજન' },
  'Obese': { en: 'Obese', hi: 'मोटापा', gu: 'સ્થૂળતા' },
  'Ideal Range': { en: 'Ideal Range', hi: 'आदर्श सीमा', gu: 'આદર્શ શ્રેણી' },
  'Your BMI': { en: 'Your BMI', hi: 'आपका बीएमआई', gu: 'તમારું BMI' },
  'Above Ideal': { en: 'Above Ideal', hi: 'आदर्श से अधिक', gu: 'આદર્શથી વધુ' },
  'Below Ideal': { en: 'Below Ideal', hi: 'आदर्श से कम', gu: 'આદર્શથી ઓછું' },
  'At Ideal': { en: 'At Ideal', hi: 'आदर्श पर', gu: 'આદર્શ પર' },
  'Personalized Health Tips': { en: 'Personalized Health Tips', hi: 'व्यक्तिगत स्वास्थ्य सुझाव', gu: 'વ્યક્તિગત સ્વાસ્થ્ય ટિપ્સ' },
  'bmi_disclaimer': {
    en: 'BMI is a general indicator and does not account for muscle mass, bone density, or other individual factors. Consult a healthcare professional for a comprehensive health assessment.',
    hi: 'बीएमआई एक सामान्य संकेतक है और मांसपेशियों, हड्डियों के घनत्व या अन्य व्यक्तिगत कारकों को ध्यान में नहीं रखता। व्यापक स्वास्थ्य मूल्यांकन के लिए किसी स्वास्थ्य पेशेवर से परामर्श लें।',
    gu: 'BMI એ સામાન્ય સૂચક છે અને સ્નાયુ, હાડકાની ઘનતા અથવા અન્ય વ્યક્તિગત પરિબળોને ધ્યાનમાં લેતો નથી. સ્વાસ્થ્ય વ્યાવસાયિક સાથે પરામર્શ કરો.',
  },

  // Stress Analyzer
  'Stress Analyzer': { en: 'Stress Analyzer', hi: 'तनाव विश्लेषक', gu: 'તણાવ વિશ્લેષક' },
  'stress_subtitle': {
    en: 'Answer 5 quick questions to assess your stress level and get personalized coping strategies.',
    hi: '5 त्वरित प्रश्नों का उत्तर दें और अपने तनाव के स्तर का आकलन करें तथा व्यक्तिगत समाधान पाएं।',
    gu: '5 ઝડપી પ્રશ્નોના જવાબ આપો, તમારા તણાવ સ્તરનું મૂલ્યાંકન કરો અને વ્યક્તિગત ઉપાયો મેળવો.',
  },
  'Question': { en: 'Question', hi: 'प्रश्न', gu: 'પ્રશ્ન' },
  'of': { en: 'of', hi: 'में से', gu: 'માંથી' },
  'Next Question': { en: 'Next Question', hi: 'अगला प्रश्न', gu: 'આગળનો પ્રશ્ન' },
  'See My Results': { en: 'See My Results', hi: 'मेरे परिणाम देखें', gu: 'મારા પરિણામ જુઓ' },
  'Take Again': { en: 'Take Again', hi: 'फिर से लें', gu: 'ફરીથી લો' },
  'Your Stress Score': { en: 'Your Stress Score', hi: 'आपका तनाव स्कोर', gu: 'તમારો તણાવ સ્કોર' },
  'Mild Stress': { en: 'Mild Stress', hi: 'हल्का तनाव', gu: 'હળવો તણાવ' },
  'Moderate Stress': { en: 'Moderate Stress', hi: 'मध्यम तनाव', gu: 'મધ્યમ તણાવ' },
  'High Stress': { en: 'High Stress', hi: 'अधिक तनाव', gu: 'વધુ તણાવ' },
  '0 — Calm': { en: '0 — Calm', hi: '0 — शांत', gu: '0 — શાંત' },
  '100 — Burnout': { en: '100 — Burnout', hi: '100 — बर्नआउट', gu: '100 — થાક' },
  'Coping Strategies for You': { en: 'Coping Strategies for You', hi: 'आपके लिए समाधान', gu: 'તમારા માટે ઉપાયો' },
  'stress_high_warning': {
    en: 'Your stress level is high. Consider taking rest and speaking with a mental health professional for personalized support.',
    hi: 'आपका तनाव स्तर उच्च है। कृपया आराम करें और व्यक्तिगत सहायता के लिए किसी मानसिक स्वास्थ्य विशेषज्ञ से बात करें।',
    gu: 'તમારો તણાવ સ્તર ઊંચો છે. આરામ કરો અને વ્યક્તિગત સહાય માટે માનસિક સ્વાસ્થ્ય નિષ્ણાત સાથે વાત કરો.',
  },

  // AI Chatbox
  'AI Health Assistant': { en: 'AI Health Assistant', hi: 'एआई स्वास्थ्य सहायक', gu: 'AI આરોગ્ય સહાયક' },
  'Powered by ArogyaAI': { en: 'Powered by ArogyaAI', hi: 'ArogyaAI द्वारा संचालित', gu: 'ArogyaAI દ્વારા સંચાલિત' },
  'chat_greeting': {
    en: "Hi! I'm ArogyaAI, your personal health assistant. Ask me anything about symptoms, diet, stress, or general wellness. 💚\n\n⚠️ Disclaimer: This is not a medical diagnosis. Always consult a healthcare professional for serious concerns.",
    hi: "नमस्ते! मैं ArogyaAI हूं, आपका व्यक्तिगत स्वास्थ्य सहायक। लक्षणों, आहार, तनाव या सामान्य स्वास्थ्य के बारे में कुछ भी पूछें। 💚\n\n⚠️ अस्वीकरण: यह चिकित्सीय निदान नहीं है। गंभीर चिंताओं के लिए हमेशा स्वास्थ्य पेशेवर से परामर्श लें।",
    gu: "નમસ્તે! હું ArogyaAI છું, તમારો વ્યક્તિગત આરોગ્ય સહાયક. લક્ષણો, આહાર, તણાવ અથવા સ્વાસ્થ્ય વિશે કંઈ પણ પૂછો. 💚\n\n⚠️ અસ્વીકૃતિ: આ તબીબી નિદાન નથી. ગંભીર ચિંતાઓ માટે સ્વાસ્થ્ય વ્યાવસાયિકની સલાહ લો.",
  },
  'Quick prompts': { en: 'Quick prompts', hi: 'त्वरित प्रश्न', gu: 'ઝડપી પ્રશ્નો' },
  'Ask a health question…': { en: 'Ask a health question…', hi: 'स्वास्थ्य संबंधी प्रश्न पूछें…', gu: 'આરોગ્ય વિશે પ્રશ્ન પૂછો…' },
  'Thinking…': { en: 'Thinking…', hi: 'सोच रहा हूं…', gu: 'વિચારું છું…' },
  'chat_error': {
    en: "Sorry, I couldn't connect right now. Please try again in a moment.",
    hi: "क्षमा करें, अभी कनेक्ट नहीं हो पाया। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
    gu: "માફ કરો, અત્યારે કનેક્ટ થઈ શક્યો નહीं. થોડા સમય પછી ફરી પ્રયાસ કરો.",
  },
  'How to reduce stress?': { en: 'How to reduce stress?', hi: 'तनाव कैसे कम करें?', gu: 'તણાવ કેવી રીતે ઘટાડવો?' },
  'Diet tips for fatigue': { en: 'Diet tips for fatigue', hi: 'थकान के लिए आहार टिप्स', gu: 'થાક માટે આહાર ટિપ્સ' },
  'How to sleep better?': { en: 'How to sleep better?', hi: 'बेहतर नींद कैसे लें?', gu: 'સારી ઊંઘ કેવી રીતે મેળવવી?' },
  'Signs I should see a doctor': { en: 'Signs I should see a doctor', hi: 'डॉक्टर से मिलने के संकेत', gu: 'ડૉક્ટરને મળવાના સંકેત' },
};

export function t(key: string, lang: Language): string {
  if (dictionary[key]) {
    return dictionary[key][lang] || dictionary[key]['en'];
  }
  return key; // Fallback to key if not found
}
