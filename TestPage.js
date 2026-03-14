import React from 'react';
import { useLanguage } from './context/LanguageContext';

const TestPage = () => {
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div style={{ padding: '50px', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <h1>{t('production.title')}</h1>
      <h2>{t('inventory.title')}</h2>
      <h3>{t('sales')}</h3>
      
      <div style={{ marginTop: '30px' }}>
        <p>Current Language: {language}</p>
        <button 
          onClick={() => changeLanguage('ar')}
          style={{ margin: '5px', padding: '10px', background: 'blue', color: 'white' }}
        >
          العربية
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          style={{ margin: '5px', padding: '10px', background: 'green', color: 'white' }}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default TestPage;