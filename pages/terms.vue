<template>
  <div class="terms-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">{{ $t('pages.terms.title') }}</h1>
      
      <div class="max-w-4xl mx-auto prose prose-lg">
        <p class="text-gray-600 mb-8">{{ $t('pages.terms.lastUpdated') }}：{{ new Date().toLocaleDateString() }}</p>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. {{ $t('pages.terms.sections.acceptance.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.terms.sections.acceptance.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. {{ $t('pages.terms.sections.serviceDescription.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.terms.sections.serviceDescription.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. {{ $t('pages.terms.sections.userResponsibilities.title') }}</h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li v-for="item in $tm('pages.terms.sections.userResponsibilities.items')" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">4. {{ $t('pages.terms.sections.intellectualProperty.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.terms.sections.intellectualProperty.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">5. {{ $t('pages.terms.sections.disclaimer.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.terms.sections.disclaimer.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">6. {{ $t('pages.terms.sections.modification.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.terms.sections.modification.content') }}
          </p>
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
    return t('pages.terms.title')
  },
  description: () => {
    const { t } = useI18n()
    return t('pages.terms.sections.acceptance.content')
  }
})
</script>