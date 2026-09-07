<template>
  <footer class="site-footer">
    <div class="container footer-panel glass-card" data-reveal>
      <div><div class="footer-brand">若烹小鲜 · <span>以敬畏驾驭复杂，以技术守护日常</span></div><div class="footer-meta"><span>最后更新 <strong>{{ currentDate }}</strong></span><span>STATUS <strong>READY FOR COLLABORATION</strong></span></div></div>
      <button class="button button--primary message-button" type="button" @click="$emit('open-inquiry')">留下项目诉求 <AppIcon name="message" /></button>
      <p class="footer-copyright">© {{ currentYear }} 北京若烹小鲜科技有限公司。我们仅在获得授权后展示合作单位和真实项目资料。</p>
    </div>
  </footer>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  currentDate: {
    type: String,
    required: true
  }
});
defineEmits(['open-inquiry']);
</script>
