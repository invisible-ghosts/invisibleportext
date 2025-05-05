import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { languages, defaultLang } from '../i18n/ui';

const LanguageSwitcher: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentLang = (() => {
    const seg = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
    return languages[defaultLang] ? seg : 'en';
  })();

  const switchTo = (lang: string) => {
    if (lang === 'en') {
      window.location.pathname = '/';
    } else {
      window.location.pathname = `/${lang}`;
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        aria-label="Switch language"
      >
        <Globe className="w-5 h-5" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="border border-black rounded-md">
            {Object.entries(languages).map(([lang, { name, flag }]) => (
              <button
                key={lang}
                onClick={() => switchTo(lang)}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  currentLang === lang ? 'bg-emerald-50 rounded-md dark:bg-gray-800' : ''
                }`}
              >
                <span className="mr-2">{flag}</span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
