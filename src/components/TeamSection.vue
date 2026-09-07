<template>
  <section class="section team-band" aria-labelledby="team-title">
    <div class="container team-panel glass-card" data-reveal>
      <div class="section-heading">
        <p class="eyebrow">team / 专业支撑</p>
        <h2 id="team-title" class="section-title team-title"><span>懂产品，也懂工程；</span><br /><span class="gradient-text">更懂项目如何落地。</span></h2>
        <p class="team-copy">团队拥有多名资深互联网产品与技术专家，具备丰富的 AI Agent 落地实操经验，可承接企业数字化升级、AI 改造、智能工作流重构等相关项目。同时具备北大、协和知名专家教授资源背书与深度资源链接能力。</p>
      </div>
      <div class="team-points">
        <article v-for="point in teamPoints" :key="point.code" class="team-point"><strong>{{ point.code }}</strong><div><h3>{{ point.title }}</h3><p>{{ point.copy }}</p></div></article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { teamPoints } from '../data/siteContent.js';
</script>
