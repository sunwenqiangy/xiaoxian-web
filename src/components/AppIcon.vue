<template>
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <template v-if="name === 'arrow'">
      <path d="m5 12 14 0m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s7-5.2 7-11A7 7 0 0 0 5 10c0 5.8 7 11 7 11Z" stroke="currentColor" stroke-width="1.8" />
      <circle cx="12" cy="10" r="2.3" fill="currentColor" />
    </template>
    <template v-else-if="name === 'message'">
      <path d="M21 11.5a7.6 7.6 0 0 1-8 7.4 8.5 8.5 0 0 1-3.3-.7L4 20l1.5-4A7.2 7.2 0 0 1 5 13c0-4.1 3.6-7.5 8-7.5s8 2.9 8 6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'software'">
      <rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" stroke-width="1.8" />
      <path d="M7 8h10M7 12h6M7 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'ai'">
      <path d="M8 4h8l4 4v8l-4 4H8l-4-4V8l4-4Z" stroke="currentColor" stroke-width="1.8" />
      <path d="M9 12h6M12 9v6M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'vertical'">
      <path d="M4 19V9l8-5 8 5v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M8 19v-5h8v5M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
});
</script>
