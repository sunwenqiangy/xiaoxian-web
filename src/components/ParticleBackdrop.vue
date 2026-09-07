<template>
  <div aria-hidden="true">
    <div class="glow glow--cyan"></div>
    <div class="glow glow--jade"></div>
    <div class="glow glow--amber"></div>
    <canvas ref="canvas" id="particles"></canvas>
    <div class="background-grid"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const canvas = ref(null);
let animationFrame;
let resizeHandler;
let pointerMoveHandler;
let pointerLeaveHandler;

onMounted(() => {
  const element = canvas.value;
  const context = element.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -1000, y: -1000 };
  const colors = ['#43d7dc', '#8be0bd', '#f2c477'];
  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  const isMobile = () => window.innerWidth < 768;
  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    size: Math.random() * 1.8 + 0.7,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    element.width = width * dpr;
    element.height = height * dpr;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: isMobile() ? 75 : 150 }, createParticle);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 170 && distance > 0) {
        const force = (170 - distance) / 170;
        particle.vx += (dx / distance) * force * 0.021;
        particle.vy += (dy / distance) * force * 0.021;
      }
      particle.vx *= 0.993;
      particle.vy *= 0.993;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -10 || particle.x > width + 10) particle.vx *= -1;
      if (particle.y < -10 || particle.y > height + 10) particle.vy *= -1;
      particle.x = Math.max(-5, Math.min(width + 5, particle.x));
      particle.y = Math.max(-5, Math.min(height + 5, particle.y));
      context.beginPath();
      context.fillStyle = particle.color;
      context.globalAlpha = 0.64;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    for (let index = 0; index < particles.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const current = particles[index];
        const next = particles[nextIndex];
        const distance = Math.hypot(current.x - next.x, current.y - next.y);
        if (distance >= 150) continue;
        const gradient = context.createLinearGradient(current.x, current.y, next.x, next.y);
        gradient.addColorStop(0, current.color);
        gradient.addColorStop(1, next.color);
        context.beginPath();
        context.strokeStyle = gradient;
        context.globalAlpha = (1 - distance / 150) * 0.2;
        context.lineWidth = 0.65;
        context.moveTo(current.x, current.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
    context.globalAlpha = 1;
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  resizeHandler = resize;
  pointerMoveHandler = (event) => { pointer.x = event.clientX; pointer.y = event.clientY; };
  pointerLeaveHandler = () => { pointer.x = -1000; pointer.y = -1000; };
  window.addEventListener('resize', resizeHandler, { passive: true });
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
  window.addEventListener('pointerleave', pointerLeaveHandler);
});

onBeforeUnmount(() => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resizeHandler);
  window.removeEventListener('pointermove', pointerMoveHandler);
  window.removeEventListener('pointerleave', pointerLeaveHandler);
});
</script>
