import { FC, useState } from 'react';

export interface Language {
  code: string;
  name: string;
}

interface LanguageMenuProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
}

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' }
];

const LanguageMenu: FC<LanguageMenuProps> = ({ onLanguageChange, currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-500"
      >
        <span>{currentLanguage.name}</span>
        <span className="text-xs">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 right-0 w-48 border bg-gray-800 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  onClick={() => {
                    onLanguageChange(language);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-500 ${
                    currentLanguage.code === language.code ? 'bg-gray-500 font-medium' : ''
                  }`}
                >
                  {language.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageMenu;