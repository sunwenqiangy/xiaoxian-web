<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }" aria-label="主导航">
    <div class="container nav-wrap">
      <a class="brand" href="#top" aria-label="若烹小鲜首页"><span class="brand-mark">鲜</span>若烹小鲜</a>
      <nav class="nav-links" aria-label="页面章节">
        <a href="#about">关于我们</a>
        <a href="#capabilities">服务能力</a>
        <a href="#cases">案例探索</a>
        <a href="#contact">联系我们</a>
      </nav>
      <button class="button button--ghost" type="button" @click="$emit('open-inquiry')">
        <span>发起交流</span><AppIcon name="arrow" />
      </button>
    </div>
  </header>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  isScrolled: Boolean
});
defineEmits(['open-inquiry']);
</script>
