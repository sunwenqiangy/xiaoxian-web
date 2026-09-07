<template>
  <section id="cases" class="section case-section" aria-labelledby="cases-title">
    <div class="container">
      <div class="case-heading" data-reveal>
        <div class="section-heading"><p class="eyebrow">case explorations / 案例探索</p><h2 id="cases-title" class="section-title">先从一件具体的事开始，<br /><span class="gradient-text">再做成可以长期运行的系统。</span></h2></div>
        <p class="case-note">以下为官网初版展示用的场景化案例，用于说明服务方向。真实合作案例与合作单位信息将按后续授权逐步开放。</p>
      </div>
      <div class="case-grid">
        <article v-for="item in cases" :key="item.id" class="case-card" tabindex="0" :aria-label="`案例：${item.title}`" data-reveal>
          <div class="case-flip">
            <div class="case-face case-front glass-card"><div class="case-topline"><span class="case-state"><i></i>SCENARIO DEMO</span><span>{{ item.domain }}</span></div><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><div class="case-mobile-detail"><span class="case-mobile-detail__label">SOLUTION DIRECTION</span><p>{{ item.detail }}</p><div class="case-stack"><span v-for="tag in item.stack" :key="tag">{{ tag }}</span></div></div><span class="case-hint">HOVER TO DECODE →</span></div>
            <div class="case-face case-back glass-card"><span class="capability-code">CASE / {{ item.id }}</span><h3>{{ item.title }}</h3><p>{{ item.detail }}</p><div class="case-stack"><span v-for="tag in item.stack" :key="tag">{{ tag }}</span></div></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { cases } from '../data/siteContent.js';
</script>
