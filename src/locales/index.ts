import { createI18n } from 'vue-i18n'
import en from './en.json'
import nl from './nl.json'

// Get language from URL, localStorage, or browser
function getInitialLocale(): string {
  // Check URL parameter (?lang=nl or ?lang=en)
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  if (urlLang && ['en', 'nl'].includes(urlLang)) {
    localStorage.setItem('dr-denker-language', urlLang)
    return urlLang
  }
  
  // Check localStorage
  const storedLang = localStorage.getItem('dr-denker-language')
  if (storedLang && ['en', 'nl'].includes(storedLang)) {
    return storedLang
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('nl')) {
    return 'nl'
  }
  
  // Default to English
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    nl
  }
})

export default i18n

// Helper function to change language
export function setLanguage(lang: 'en' | 'nl') {
  i18n.global.locale.value = lang
  localStorage.setItem('dr-denker-language', lang)
  document.documentElement.setAttribute('lang', lang)
}
