
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface LanguageSwitchProps {
  className?: string;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      className={`flex items-center gap-2 ${className}`}
    >
      <Languages size={16} />
      <span>{language === 'en' ? t('switchToArabic') : t('switchToEnglish')}</span>
    </Button>
  );
};

export default LanguageSwitch;
