<script setup lang="ts">
import AboutSection from '@/components/sections/AboutSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import ExperienceSection from '@/components/sections/ExperienceSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import { useSectionRoute } from '@/composables/useSectionRoute'
import { useSectionTheme } from '@/composables/useSectionTheme'

useSectionTheme()
useSectionRoute()
</script>

<template>
  <main id="main">
    <HeroSection />
    <ProjectsSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ContactSection />
  </main>
</template>
