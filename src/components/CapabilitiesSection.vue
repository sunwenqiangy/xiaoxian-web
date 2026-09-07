<template>
  <section id="capabilities" class="section" aria-labelledby="capabilities-title">
    <div class="container">
      <div class="section-heading" data-reveal>
        <p class="eyebrow">capabilities / 服务能力</p>
        <h2 id="capabilities-title" class="section-title">从稳定系统，到智能协作，<br /><span class="gradient-text">我们把能力沉到业务现场。</span></h2>
        <p class="section-copy">覆盖传统软件研发、AI 智能应用衍生产品与垂类定制开发，为企业数字化升级、AI 改造和智能工作流重构提供可持续的交付能力。</p>
      </div>
      <div class="capability-grid">
        <article v-for="capability in capabilities" :key="capability.code" class="capability-card glass-card" data-reveal>
          <span class="capability-code">{{ capability.code }}</span>
          <div class="capability-icon" aria-hidden="true"><AppIcon :name="capability.icon" /></div>
          <h3>{{ capability.title }}</h3>
          <p>{{ capability.description }}</p>
          <div class="capability-tags"><span v-for="tag in capability.tags" :key="tag">{{ tag }}</span></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import { capabilities } from '../data/siteContent.js';
</script>
