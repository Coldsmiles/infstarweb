<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseModal from '../components/base/BaseModal.vue';
import EmptyState from '../components/base/EmptyState.vue';

const sponsors = ref([]);
const grandTotal = ref(0);
const animatedTotal = ref(0);
const searchQuery = ref('');
const projectFilter = ref('all');
const modalOpen = ref(false);

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  fetch('/data/sponsors.txt')
    .then(r => r.text())
    .then(text => {
      const parsed = parseSponsors(text);
      let total = 0;
      parsed.forEach(item => { total += item.amount; });
      grandTotal.value = total;
      sponsors.value = [...parsed].reverse(); // newest first
      animateTotal(total);
    });
});

function parseSponsors(text) {
  if (!text) return [];
  const result = [];
  text.trim().split('\n').forEach(line => {
    const parts = line.split(',');
    if (parts.length < 3) return;
    const name = parts[0].trim();
    const project = parts[1].trim();
    const amount = parseFloat(parts[2].trim().replace('￥', ''));
    const date = parts[3] ? parts[3].trim() : '';
    if (!isNaN(amount)) result.push({ name, project, amount, date });
  });
  return result;
}

function animateTotal(end) {
  const duration = 2000;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    animatedTotal.value = Math.floor(ease * end);
    if (progress < 1) requestAnimationFrame(step);
    else animatedTotal.value = end;
  }
  requestAnimationFrame(step);
}

// Unique projects for filters
const projectOptions = computed(() => {
  const set = new Set();
  sponsors.value.forEach(s => { if (s.project) set.add(s.project); });
  return Array.from(set);
});

const filtered = computed(() => {
  return sponsors.value.filter(item => {
    const matchProject = projectFilter.value === 'all' || item.project === projectFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || item.name.toLowerCase().includes(q);
    return matchProject && matchSearch;
  });
});

function formatAmount(n) {
  return '¥' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setProject(p) {
  projectFilter.value = p;
}
</script>

<template>
  <!-- Hero -->
  <section class="sponsor-hero">
    <h1>感谢每一位支持者</h1>
    <div class="total-donations">
      <span class="counter-label">累计获得赞助</span>
      <span class="counter-value">¥{{ animatedTotal.toLocaleString('en-US') }}</span>
    </div>
    <p class="hero-subtitle">因为有你们，白鹿原才能走得更远。</p>
  </section>

  <main class="sponsor-container bl-shell">
    <!-- Controls -->
    <div class="controls-section">
      <h2 class="section-title sponsor-list-title">❤️ 赞助列表</h2>
      <div class="controls-header">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索赞助者姓名..."
          >
        </div>
        <button class="cta-button outline" @click="modalOpen = true">
          <i class="fas fa-heart"></i> 我要支持
        </button>
      </div>
      <div class="filter-tags">
        <button
          :class="['filter-tag', { active: projectFilter === 'all' }]"
          @click="setProject('all')"
        >全部</button>
        <button
          v-for="proj in projectOptions"
          :key="proj"
          :class="['filter-tag', { active: projectFilter === proj }]"
          @click="setProject(proj)"
        >{{ proj }}</button>
      </div>
    </div>

    <!-- Donation Grid -->
    <div v-if="filtered.length" class="donation-grid">
      <div
        v-for="(item, idx) in filtered"
        :key="idx"
        class="donation-card"
        :style="{ animationDelay: Math.min(idx * 0.05, 1) + 's' }"
      >
        <div class="donation-header">
          <div class="donor-info">
            <img
              :src="`https://minotar.net/helm/${item.name}/64.png`"
              class="mini-avatar"
              :alt="item.name"
              loading="lazy"
              @error="($event.target).src = 'https://minotar.net/helm/MHF_Steve/64.png'"
            >
            <div class="donor-name">{{ item.name }}</div>
          </div>
          <div class="donation-amount">¥{{ item.amount }}</div>
        </div>
        <div class="donation-card-body">
          <div class="donation-purpose">{{ item.project }}</div>
          <div class="donation-date">
            <i class="far fa-clock donation-date-icon"></i>{{ item.date }}
          </div>
        </div>
      </div>
    </div>

    <EmptyState v-else title="暂无记录" description="没有找到匹配的赞助记录。" />

    <!-- Sponsor Modal -->
    <BaseModal :model-value="modalOpen" width="480px" @update:model-value="modalOpen = $event">
      <template #header>
        <div class="modal-gift-icon">
          <i class="fas fa-gift"></i>
        </div>
        <h3 class="modal-title">支持白鹿原服务器</h3>
        <p class="modal-subtitle">您的每一次支持，都将帮助我们提升服务器性能，维持更长久的运营。</p>
      </template>

      <!-- Desktop QR -->
      <div v-if="!isMobile" class="desktop-qr-view">
        <div class="qr-placeholder">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fqr.alipay.com%2F2cz0344fnaulnbybhp04"
            alt="支付宝二维码"
            class="qr-img"
          >
        </div>
        <p class="desktop-qr-hint">推荐使用支付宝扫码</p>
      </div>

      <!-- Mobile Button -->
      <div v-else class="mobile-btn-view">
        <a
          href="https://qr.alipay.com/2cz0344fnaulnbybhp04"
          class="alipay-btn"
          target="_blank"
          rel="noopener"
        >
          <i class="fab fa-alipay"></i> 打开支付宝赞助
        </a>
        <p class="mobile-pay-hint">点击按钮将直接跳转至支付宝转账页面</p>
      </div>
    </BaseModal>
  </main>
</template>

<style scoped>
/* Hero */
.sponsor-hero {
  padding: calc(var(--bl-header-height) + 60px) 20px 60px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.sponsor-hero h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 24px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.total-donations {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.counter-label {
  font-size: 16px;
  opacity: 0.85;
  margin-bottom: 8px;
}

.counter-value {
  font-size: 56px;
  font-weight: 800;
  font-family: 'Inter', sans-serif;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin: 0;
}

/* Container */
.sponsor-container {
  padding: 40px 20px;
}

/* Controls */
.controls-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 20px;
}

.controls-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bl-surface-strong);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 10px 16px;
  flex: 1;
  min-width: 200px;
}

.search-box i {
  color: var(--bl-text-secondary);
  font-size: 14px;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  width: 100%;
  color: var(--bl-text);
  font-family: inherit;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--bl-transition);
  border: none;
  font-family: inherit;
}

.cta-button.outline {
  background: transparent;
  border: 2px solid var(--bl-accent);
  color: var(--bl-accent);
}

.cta-button.outline:hover {
  background: var(--bl-accent);
  color: #fff;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--bl-transition);
  color: var(--bl-text-secondary);
  font-family: inherit;
}

.filter-tag:hover {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
}

.filter-tag.active {
  background: var(--bl-accent);
  color: #fff;
  border-color: var(--bl-accent);
}

/* Donation Grid */
.donation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.donation-card {
  background: var(--bl-surface-strong);
  border-radius: var(--bl-radius-lg);
  padding: 20px;
  box-shadow: var(--bl-shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.donation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.donor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eee;
}

.donor-name {
  font-size: 16px;
  font-weight: 600;
}

.donation-amount {
  font-size: 20px;
  font-weight: 700;
  color: var(--bl-accent);
  font-family: 'Inter', sans-serif;
}

.donation-card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.donation-purpose {
  font-size: 13px;
  color: var(--bl-text-secondary);
  font-weight: 500;
}

.donation-date {
  font-size: 12px;
  color: var(--bl-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.donation-date-icon {
  font-size: 11px;
}

/* Modal */
.modal-gift-icon {
  text-align: center;
  margin-bottom: 12px;
}

.modal-gift-icon i {
  font-size: 48px;
  color: var(--bl-accent);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 8px;
}

.modal-subtitle {
  font-size: 15px;
  color: var(--bl-text-secondary);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.desktop-qr-view,
.mobile-btn-view {
  text-align: center;
  padding: 24px 0 0;
}

.qr-placeholder {
  display: inline-block;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.qr-img {
  width: 200px;
  height: 200px;
  display: block;
}

.desktop-qr-hint {
  font-size: 13px;
  color: var(--bl-text-secondary);
  margin-top: 12px;
}

.alipay-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: #1677ff;
  color: #fff;
  border-radius: 14px;
  text-decoration: none;
  font-size: 17px;
  font-weight: 700;
  transition: var(--bl-transition);
}

.alipay-btn:hover {
  background: #0958d9;
  transform: translateY(-2px);
}

.mobile-pay-hint {
  font-size: 13px;
  color: var(--bl-text-secondary);
  margin-top: 12px;
}

@media (max-width: 768px) {
  .sponsor-hero h1 { font-size: 32px; }
  .counter-value { font-size: 40px; }
  .donation-grid { grid-template-columns: 1fr; }
  .controls-header { flex-direction: column; }
  .search-box { width: 100%; }
}
</style>
