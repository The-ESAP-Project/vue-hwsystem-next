export const getStoredLocale = (): string => {
  if (typeof window === 'undefined') return 'zh'
  return localStorage.getItem('i18n_locale') || getBrowserLocale()
}

export const getBrowserLocale = (): string => {
  if (typeof window === 'undefined') return 'zh'
  const navigatorLocale = navigator.language
  const locale = navigatorLocale.trim().split(/-|_/)[0]
  return ['zh', 'en', 'ja'].includes(locale) ? locale : 'zh'
}

export const setLocale = (locale: string) => {
  localStorage.setItem('i18n_locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}