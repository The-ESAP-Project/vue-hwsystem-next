<template>
  <div class="about-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">{{ $t('pages.about.title') }}</h1>
      
      <div class="max-w-4xl mx-auto">
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('pages.about.companyIntro') }}</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            {{ $t('pages.about.companyDescription1') }}
          </p>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.about.companyDescription2') }}
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('pages.about.ourAdvantages') }}</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-2">{{ $t('pages.about.advantages.professionalTeam.title') }}</h3>
              <p class="text-gray-600">{{ $t('pages.about.advantages.professionalTeam.description') }}</p>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-2">{{ $t('pages.about.advantages.qualityAssurance.title') }}</h3>
              <p class="text-gray-600">{{ $t('pages.about.advantages.qualityAssurance.description') }}</p>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-lg">
              <h3 class="text-xl font-semibold mb-2">{{ $t('pages.about.advantages.customerService.title') }}</h3>
              <p class="text-gray-600">{{ $t('pages.about.advantages.customerService.description') }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO meta tags
useSeoMeta({
  title: () => {
    const { t } = useI18n()
    return t('pages.about.title')
  },
  description: () => {
    const { t } = useI18n()
    return t('pages.about.companyDescription1')
  }
})
</script>