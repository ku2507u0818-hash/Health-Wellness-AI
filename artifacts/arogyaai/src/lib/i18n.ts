export type Language = 'en' | 'hi' | 'gu';

const dictionary: Record<string, Record<Language, string>> = {
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
};

export function t(key: string, lang: Language): string {
  if (dictionary[key]) {
    return dictionary[key][lang] || dictionary[key]['en'];
  }
  return key; // Fallback to key if not found
}
