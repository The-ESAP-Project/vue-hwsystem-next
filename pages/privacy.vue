<template>
  <div class="privacy-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">{{ $t('pages.privacy.title') }}</h1>
      
      <div class="max-w-4xl mx-auto prose prose-lg">
        <p class="text-gray-600 mb-8">{{ $t('pages.privacy.effectiveDate') }}：{{ new Date().toLocaleDateString() }}</p>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">1. {{ $t('pages.privacy.sections.informationCollection.title') }}</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            {{ $t('pages.privacy.sections.informationCollection.description') }}
          </p>
          <ul class="list-disc pl-6 text-gray-700">
            <li v-for="item in $tm('pages.privacy.sections.informationCollection.items')" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">2. {{ $t('pages.privacy.sections.informationUse.title') }}</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            {{ $t('pages.privacy.sections.informationUse.description') }}
          </p>
          <ul class="list-disc pl-6 text-gray-700">
            <li v-for="item in $tm('pages.privacy.sections.informationUse.items')" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">3. {{ $t('pages.privacy.sections.informationSharing.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.privacy.sections.informationSharing.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">4. {{ $t('pages.privacy.sections.dataSecurity.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.privacy.sections.dataSecurity.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">5. {{ $t('pages.privacy.sections.cookies.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.privacy.sections.cookies.content') }}
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">6. {{ $t('pages.privacy.sections.userRights.title') }}</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            {{ $t('pages.privacy.sections.userRights.description') }}
          </p>
          <ul class="list-disc pl-6 text-gray-700">
            <li v-for="item in $tm('pages.privacy.sections.userRights.items')" :key="item">
              {{ item }}
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">7. {{ $t('pages.privacy.sections.contactUs.title') }}</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ $t('pages.privacy.sections.contactUs.content') }}
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
    return t('pages.privacy.title')
  },
  description: () => {
    const { t } = useI18n()
    return t('pages.privacy.sections.informationCollection.description')
  }
})
</script>