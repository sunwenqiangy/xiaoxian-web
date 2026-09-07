<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero-grid">
      <div class="hero-copy">
        <p class="hero-kicker entry entry--first"><i class="pulse-dot" aria-hidden="true"></i>RUOPENG XIAOXIAN / TECHNOLOGY STUDIO</p>
        <h1 id="hero-title" class="hero-title entry entry--second"><span class="hero-title__line">以敬畏驾驭复杂，</span><span class="hero-title__line">以技术守护日常。</span></h1>
        <p class="hero-copy-text entry entry--third">我们让传统软件、AI 智能应用与真实场景彼此协同，用有分寸的工程能力，服务企业数字化升级与值得长期投入的生活议题。</p>
        <div class="hero-actions entry entry--fourth">
          <a class="button button--primary" href="#capabilities">了解服务能力 <AppIcon name="arrow" /></a>
          <button class="button button--ghost" type="button" @click="$emit('open-inquiry')">讨论您的项目</button>
        </div>
        <div class="hero-support entry entry--fourth">
          <span><strong>SOFTWARE</strong> 传统软件研发</span>
          <span><strong>AI AGENT</strong> 智能应用落地</span>
          <span><strong>CARE</strong> 健康与养老场景</span>
        </div>
      </div>
      <figure class="calibration entry entry--third" aria-label="象征系统分寸与协同的动态刻度图">
        <span class="calibration-label">THE RIGHT MEASURE / 01</span>
        <div class="calibration-core">分寸</div>
        <figcaption class="calibration-note">理解全局，敬畏边界；不以技术堆砌复杂，而以恰到好处的方式解决真正的问题。</figcaption>
      </figure>
    </div>
    <span class="scroll-cue" aria-hidden="true">SCROLL</span>
  </section>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineEmits(['open-inquiry']);
</script>
