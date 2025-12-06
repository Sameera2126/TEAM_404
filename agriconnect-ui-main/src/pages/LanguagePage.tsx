import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/types';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

const LanguagePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useAuth();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigate('/role-select');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col max-w-md mx-auto w-full"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Choose Language
        </h1>
        <p className="text-muted-foreground mb-8">
          Select your preferred language
        </p>

        {/* Language Options */}
        <div className="space-y-3 flex-1">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                language === lang.code
                  ? 'border-primary bg-primary/5 shadow-soft'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-foreground text-lg">
                  {lang.nativeName}
                </p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
              {language === lang.code && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LanguagePage;
