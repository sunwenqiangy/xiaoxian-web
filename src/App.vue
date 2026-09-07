<template>
  <ParticleBackdrop />
  <a class="skip-link" href="#main-content">跳到主要内容</a>

  <div class="site-shell">
    <SiteHeader :is-scrolled="isScrolled" @open-inquiry="openInquiry" />

    <main id="main-content">
      <HeroSection @open-inquiry="openInquiry" />
      <AboutSection />
      <CapabilitiesSection />
      <TeamSection />
      <CasesSection />
      <PartnerSection />
      <ContactSection :business-email="businessEmail" @open-inquiry="openInquiry" />
    </main>

    <SiteFooter :current-year="currentYear" :current-date="currentDate" @open-inquiry="openInquiry" />
  </div>

  <InquiryModal :open="isInquiryOpen" :business-email="businessEmail" @close="closeInquiry" />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AboutSection from './components/AboutSection.vue';
import CapabilitiesSection from './components/CapabilitiesSection.vue';
import CasesSection from './components/CasesSection.vue';
import ContactSection from './components/ContactSection.vue';
import HeroSection from './components/HeroSection.vue';
import InquiryModal from './components/InquiryModal.vue';
import PartnerSection from './components/PartnerSection.vue';
import ParticleBackdrop from './components/ParticleBackdrop.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
import TeamSection from './components/TeamSection.vue';

const businessEmail = import.meta.env.VITE_BUSINESS_EMAIL || 'beiming5029@163.com';
const isInquiryOpen = ref(false);
const isScrolled = ref(false);
const previousFocus = ref(null);
const currentYear = new Date().getFullYear();
const currentDate = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).replaceAll('/', '.');
let observer;

const updateHeader = () => { isScrolled.value = window.scrollY > 18; };
const openInquiry = () => {
  previousFocus.value = document.activeElement;
  isInquiryOpen.value = true;
};
const closeInquiry = async () => {
  isInquiryOpen.value = false;
  await nextTick();
  previousFocus.value?.focus?.();
};

onMounted(() => {
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  } else items.forEach((item) => item.classList.add('is-visible'));
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeader);
  observer?.disconnect();
});
</script>
