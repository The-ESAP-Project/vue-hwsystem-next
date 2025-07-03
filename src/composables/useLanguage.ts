import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// 导出语言管理的 composable
export function useLanguage() {
  const { locale, t } = useI18n()

  // 可用语言列表
  const availableLocales = [
    { code: 'zh', name: '中文', shortName: '中' },
    { code: 'en', name: 'English', shortName: 'EN' },
  ]

  // 当前语言信息
  const currentLocale = computed(() => {
    return availableLocales.find((lang) => lang.code === locale.value) || availableLocales[0]
  })

  // 切换语言
  const setLocale = (lang: string) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  return {
    locale,
    availableLocales,
    currentLocale,
    setLocale,
    t,
  }
}
