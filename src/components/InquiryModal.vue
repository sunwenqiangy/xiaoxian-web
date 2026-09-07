<template>
  <div v-if="open" ref="modal" class="modal-backdrop is-open" aria-hidden="false">
    <section class="inquiry-modal glass-card" role="dialog" aria-modal="true" aria-labelledby="inquiry-title" aria-describedby="inquiry-desc">
      <template v-if="!isSubmitted">
        <div class="modal-header"><div><h2 id="inquiry-title" class="modal-title">发起项目咨询</h2><p id="inquiry-desc" class="modal-desc">请留下必要信息。提交后，我们将通过企业业务邮箱通知团队跟进。</p></div><button class="modal-close" type="button" aria-label="关闭项目咨询窗口" @click="close"><AppIcon name="close" /></button></div>
        <form class="inquiry-form" novalidate @submit.prevent="submitInquiry">
          <div v-if="showErrorSummary" class="form-error-summary field--full" role="alert" aria-live="assertive"><strong>请完善标红的信息</strong><span>填写或确认后即可提交项目咨询。</span></div>
          <div class="field" :class="{ 'has-error': fieldErrors.name }">
            <label for="lead-name">您的称呼</label>
            <input id="lead-name" ref="firstInput" v-model.trim="form.name" :aria-describedby="fieldErrors.name ? 'lead-name-error' : undefined" :aria-invalid="Boolean(fieldErrors.name)" maxlength="30" autocomplete="name" required placeholder="怎么称呼您？" @blur="validateField('name')" @input="clearFieldError('name')" />
            <p v-if="fieldErrors.name" id="lead-name-error" class="field-error">{{ fieldErrors.name }}</p>
          </div>
          <div class="field"><label for="lead-company">公司 / 组织</label><input id="lead-company" v-model.trim="form.company" maxlength="60" autocomplete="organization" placeholder="选填" /></div>
          <div class="field" :class="{ 'has-error': fieldErrors.contact }">
            <label for="lead-contact">联系方式</label>
            <input id="lead-contact" v-model.trim="form.contact" :aria-describedby="fieldErrors.contact ? 'lead-contact-error' : undefined" :aria-invalid="Boolean(fieldErrors.contact)" maxlength="100" autocomplete="email" required placeholder="手机号或邮箱" @blur="validateField('contact')" @input="clearFieldError('contact')" />
            <p v-if="fieldErrors.contact" id="lead-contact-error" class="field-error">{{ fieldErrors.contact }}</p>
          </div>
          <div class="field"><label for="lead-service">感兴趣的服务</label><select id="lead-service" v-model="form.service"><option v-for="option in serviceOptions" :key="option" :value="option">{{ option }}</option></select></div>
          <div class="field field--full" :class="{ 'has-error': fieldErrors.need }">
            <label for="lead-need">项目诉求</label>
            <textarea id="lead-need" v-model.trim="form.need" :aria-describedby="fieldErrors.need ? 'lead-need-error' : undefined" :aria-invalid="Boolean(fieldErrors.need)" maxlength="500" required placeholder="请简要说明业务场景、当前问题或希望达成的目标。" @blur="validateField('need')" @input="clearFieldError('need')"></textarea>
            <p v-if="fieldErrors.need" id="lead-need-error" class="field-error">{{ fieldErrors.need }}</p>
          </div>
          <div class="website-trap" aria-hidden="true"><label for="lead-website">网站</label><input id="lead-website" v-model="form.website" tabindex="-1" autocomplete="off" /></div>
          <div v-if="turnstileSiteKey" ref="turnstileElement" class="turnstile field--full"></div>
          <label class="consent field--full" :class="{ 'has-error': fieldErrors.consent }"><input v-model="form.consent" :aria-describedby="fieldErrors.consent ? 'lead-consent-error' : undefined" :aria-invalid="Boolean(fieldErrors.consent)" type="checkbox" required @change="validateField('consent')" /><span>我同意将上述信息用于项目咨询、业务联系与后续跟进。</span></label>
          <p v-if="fieldErrors.consent" id="lead-consent-error" class="field-error field--full">{{ fieldErrors.consent }}</p>
          <p class="form-note">我们不会公开展示您的咨询内容。若提交遇到问题，您也可以直接邮件联系 <a :href="`mailto:${businessEmail}`">{{ businessEmail }}</a>。</p>
          <div class="form-footer"><p v-if="status.text" class="form-status" :class="status.type ? `is-${status.type}` : ''" aria-live="polite">{{ status.text }}</p><button class="button button--primary" type="submit" :disabled="isSubmitting">{{ isSubmitting ? '正在提交…' : '提交项目咨询' }}</button></div>
        </form>
      </template>
      <div v-else class="submission-success"><div class="success-mark" aria-hidden="true">✓</div><h2>咨询已提交</h2><p>我们已收到您的项目诉求，业务团队将尽快通过您留下的联系方式与您沟通。</p><p class="submission-id">线索编号：{{ submissionId }}</p><button class="button button--primary" type="button" @click="close">完成</button></div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';
import { serviceOptions } from '../data/siteContent.js';

const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_PHONE_PATTERN = /^(?:\+?86[- ]?)?1[3-9]\d{9}$/;
const props = defineProps({
  open: Boolean,
  businessEmail: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['close']);
const firstInput = ref(null);
const modal = ref(null);
const turnstileElement = ref(null);
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const hasSubmittedAttempt = ref(false);
const submissionId = ref('');
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const status = reactive({ text: '', type: '' });
const fieldErrors = reactive({ name: '', contact: '', need: '', consent: '' });
const form = reactive({ name: '', company: '', contact: '', service: serviceOptions[0], need: '', consent: false, website: '', turnstileToken: '' });
const hasErrors = computed(() => Object.values(fieldErrors).some(Boolean));
const showErrorSummary = computed(() => hasSubmittedAttempt.value && hasErrors.value);
let turnstileWidgetId;
let turnstileScriptPromise;

const resetForm = () => Object.assign(form, { name: '', company: '', contact: '', service: serviceOptions[0], need: '', consent: false, website: '', turnstileToken: '' });
const clearFieldError = (field) => { fieldErrors[field] = ''; };
const clearFieldErrors = () => Object.keys(fieldErrors).forEach(clearFieldError);
const validateField = (field) => {
  if (field === 'name') fieldErrors.name = form.name ? '' : '请填写您的称呼。';
  if (field === 'contact') {
    const contact = form.contact.replaceAll(' ', '').replaceAll('-', '');
    fieldErrors.contact = !form.contact ? '请填写手机号或邮箱。' : (!CONTACT_EMAIL_PATTERN.test(form.contact) && !CONTACT_PHONE_PATTERN.test(contact) ? '请填写有效的手机号或邮箱。' : '');
  }
  if (field === 'need') fieldErrors.need = form.need ? '' : '请简要说明您的项目诉求。';
  if (field === 'consent') fieldErrors.consent = form.consent ? '' : '提交前请确认信息使用授权。';
};
const validateForm = () => {
  ['name', 'contact', 'need', 'consent'].forEach(validateField);
  return !hasErrors.value;
};
const focusFirstInvalid = async () => {
  await nextTick();
  modal.value?.querySelector('[aria-invalid="true"]')?.focus();
};
const loadTurnstile = () => {
  if (!turnstileSiteKey || window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('人机验证组件加载失败，请检查网络后重试。'));
    document.head.append(script);
  });
  return turnstileScriptPromise;
};
const renderTurnstile = async () => {
  if (!turnstileSiteKey || !turnstileElement.value || turnstileWidgetId !== undefined) return;
  try {
    await loadTurnstile();
    turnstileWidgetId = window.turnstile.render(turnstileElement.value, {
      sitekey: turnstileSiteKey,
      theme: 'dark',
      callback: (token) => { form.turnstileToken = token; },
      'expired-callback': () => { form.turnstileToken = ''; },
      'error-callback': () => { form.turnstileToken = ''; }
    });
  } catch (error) {
    status.text = error.message;
    status.type = 'error';
  }
};
const removeTurnstile = () => {
  if (turnstileWidgetId !== undefined && window.turnstile) window.turnstile.remove(turnstileWidgetId);
  turnstileWidgetId = undefined;
  form.turnstileToken = '';
};
const close = () => emit('close');
const focusTrap = (event) => {
  if (!props.open || event.key !== 'Tab') return;
  const focusable = [...modal.value?.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[href],[tabindex]:not([tabindex="-1"])') || []];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
};
const submitInquiry = async () => {
  hasSubmittedAttempt.value = true;
  if (!validateForm()) {
    status.text = '';
    status.type = '';
    focusFirstInvalid();
    return;
  }
  isSubmitting.value = true;
  status.text = '正在安全提交您的咨询…';
  status.type = '';
  try {
    const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: window.location.href }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) throw new Error(payload.message || '提交暂时未成功，请稍后重试。');
    submissionId.value = payload.leadId || '已登记';
    isSubmitted.value = true;
    resetForm();
    clearFieldErrors();
  } catch (error) {
    status.text = error.message || '提交暂时未成功，请稍后重试或直接邮件联系我们。';
    status.type = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => props.open, async (isOpen) => {
  document.body.classList.toggle('modal-open', isOpen);
  if (!isOpen) { removeTurnstile(); return; }
  isSubmitted.value = false;
  hasSubmittedAttempt.value = false;
  clearFieldErrors();
  status.text = '';
  status.type = '';
  await nextTick();
  firstInput.value?.focus();
  renderTurnstile();
}, { immediate: true });

document.addEventListener('keydown', focusTrap);
onBeforeUnmount(() => {
  document.removeEventListener('keydown', focusTrap);
  removeTurnstile();
  document.body.classList.remove('modal-open');
});
</script>
