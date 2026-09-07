<template>
  <section id="contact" class="section contact-section" aria-labelledby="contact-title">
    <div class="container contact-panel">
      <div data-reveal>
        <p class="eyebrow">start a conversation / 联系我们</p>
        <h2 id="contact-title" class="section-title">先把真实的问题，<br /><span class="gradient-text">放到同一张桌面上。</span></h2>
        <p class="contact-copy">无论您正在规划企业数字化升级、AI 改造、智能工作流重构，还是需要一支理解高专业度场景的产品技术团队，我们愿意从一次具体交流开始。</p>
        <div class="contact-list">
          <div class="contact-line"><AppIcon name="mail" /><a :href="`mailto:${businessEmail}`">{{ businessEmail }}</a></div>
          <div class="contact-line"><AppIcon name="pin" /><span>北京 · 面向全国提供服务</span></div>
        </div>
      </div>
      <aside class="inquiry-card glass-card" data-reveal><p class="eyebrow">PROJECT INQUIRY</p><h3>说说您正在解决的事</h3><p>留下项目诉求和联系方式，我们会安全保存线索并尽快由业务团队与您联系。</p><button class="button button--primary" type="button" @click="$emit('open-inquiry')">发起项目咨询 <AppIcon name="arrow" /></button></aside>
    </div>
  </section>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  businessEmail: {
    type: String,
    required: true
  }
});
defineEmits(['open-inquiry']);
</script>
