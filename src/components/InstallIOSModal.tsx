import { useState } from 'react';

// Types pour les traductions
type Language = 'ar' | 'fr' | 'en';

interface Translations {
  title: string;
  description: string;
  step1: string;
  step2: string;
  step3: string;
  button: string;
}

// Objet de traductions centralisé
const translations: Record<Language, Translations> = {
  ar: {
    title: "📲 تثبيت التطبيق",
    description: "لتثبيت التطبيق على iPhone:",
    step1: "1️⃣ اضغط على زر المشاركة ⬆️",
    step2: "2️⃣ اختر 'إضافة إلى الشاشة الرئيسية'",
    step3: "3️⃣ اضغط 'إضافة'",
    button: "حسناً"
  },
  fr: {
    title: "📲 تثبيت التطبيق",
    description: "لتثبيت التطبيق على iPhone :",
    step1: "1️⃣ اضغط على زر المشاركة ⬆️",
    step2: "2️⃣ اختر 'Ajouter à l'écran d'accueil'",
    step3: "3️⃣ اضغط 'Ajouter'",
    button: "حسناً"
  },
  en: {
    title: "📲 تثبيت التطبيق",
    description: "لتثبيت التطبيق على iPhone:",
    step1: "1️⃣ اضغط على زر المشاركة ⬆️",
    step2: "2️⃣ اختر 'Add to Home Screen'",
    step3: "3️⃣ اضغط 'Add'",
    button: "حسناً"
  }
};

export default function InstallIOSModal({ onClose }: { onClose: () => void }) {
  // Arabe comme langue par défaut
  const [activeLang, setActiveLang] = useState<Language>('ar');
  
  // Récupérer les traductions pour la langue active
  const t = translations[activeLang];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center">
        {/* Language Tabs */}
        <div className="flex justify-center gap-2 mb-4" dir="ltr">
          <button
            onClick={() => setActiveLang('ar')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeLang === 'ar' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setActiveLang('fr')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeLang === 'fr' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Français
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeLang === 'en' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            English
          </button>
        </div>

        {/* Contenu avec direction conditionnelle */}
        <div dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
          <h2 className="text-xl font-bold mb-3 text-emerald-700">
            {t.title}
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            {t.description}
          </p>

          <ol className={`text-sm text-gray-700 mb-5 space-y-2 ${
            activeLang === 'ar' ? 'text-right' : 'text-left'
          }`}>
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="bg-emerald-600 text-white rounded-lg py-2 px-4 hover:bg-emerald-700 transition-colors"
        >
          {t.button}
        </button>
      </div>
    </div>
  );
}