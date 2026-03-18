<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import FilterPanel from '../components/shared/FilterPanel.vue';
import BaseBadge from '../components/base/BaseBadge.vue';
import EmptyState from '../components/base/EmptyState.vue';

const route = useRoute();

const announcements = ref([]);
const searchQuery = ref('');
const categoryFilter = ref('all');
const expandedId = ref(null);
const editMode = ref(false);
const sharedId = ref(null);

// Secret "edit" keyboard shortcut
let secretBuffer = '';
function onSecretKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
  secretBuffer += e.key.toLowerCase();
  if (secretBuffer.length > 4) secretBuffer = secretBuffer.slice(-4);
  if (secretBuffer === 'edit') {
    editMode.value = !editMode.value;
    secretBuffer = '';
  }
}

onMounted(() => {
  document.addEventListener('keydown', onSecretKey);
  fetch('/data/announcements.json')
    .then(r => r.json())
    .then(data => {
      data.sort((a, b) => new Date(b.time) - new Date(a.time));
      announcements.value = data;
      // Expand first item by default
      if (data.length > 0) {
        expandedId.value = generateAnchorId(data[0]);
      }
      nextTick(() => handleHash());
    });
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onSecretKey);
});

// Hash-based deep linking
function handleHash() {
  const hash = route.hash.replace('#', '');
  if (!hash) return;
  const match = announcements.value.find(item => generateAnchorId(item) === hash);
  if (match) {
    expandedId.value = hash;
    nextTick(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

function generateAnchorId(item) {
  const raw = (item.time || '') + '_' + (item.title || '');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return 'a' + Math.abs(hash).toString(36);
}

const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: 'activity', label: '活动' },
  { value: 'maintenance', label: '维护' },
  { value: 'other', label: '其他' },
];

const categoryLabelMap = { activity: '活动', maintenance: '维护', other: '其他' };
const categoryToneMap = { activity: 'success', maintenance: 'warning', other: 'purple' };

const filtered = computed(() => {
  return announcements.value.filter(item => {
    const matchCat = categoryFilter.value === 'all' || item.category === categoryFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.intro.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
});

function toggleItem(anchorId) {
  expandedId.value = expandedId.value === anchorId ? null : anchorId;
}

function shareItem(item, event) {
  event.stopPropagation();
  const anchorId = generateAnchorId(item);
  const url = location.origin + location.pathname + '#' + anchorId;
  navigator.clipboard.writeText(url).then(() => {
    sharedId.value = anchorId;
    setTimeout(() => { sharedId.value = null; }, 2000);
  });
}

function parseBV(input) {
  if (!input) return null;
  const m = input.trim().match(/(BV[A-Za-z0-9]{10,})/);
  return m ? m[1] : null;
}

function onFilterChange({ key, value }) {
  if (key === 'category') categoryFilter.value = value;
}
</script>

<template>
  <!-- Page Hero -->
  <section class="page-hero announcements-hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">活动公告</h1>
      <p class="hero-subtitle">了解服务器最新动态、活动安排与维护通知。</p>
    </div>
  </section>

  <main class="announcements-container bl-shell">
    <!-- Controls -->
    <FilterPanel
      title="公告列表"
      :search-value="searchQuery"
      search-placeholder="搜索标题或简介..."
      :filters="[
        { key: 'category', label: '分类', options: categoryOptions, modelValue: categoryFilter },
      ]"
      @update:search-value="searchQuery = $event"
      @change-filter="onFilterChange"
    />

    <!-- Timeline -->
    <div v-if="filtered.length" class="timeline">
      <div
        v-for="(item, index) in filtered"
        :key="generateAnchorId(item)"
        :id="generateAnchorId(item)"
        :class="['timeline-item', `category-${item.category}`]"
      >
        <div :class="['announcement-card', { expanded: expandedId === generateAnchorId(item) }]">
          <!-- Summary -->
          <button type="button" class="card-summary" @click="toggleItem(generateAnchorId(item))">
            <div class="card-summary-main">
              <div class="card-summary-top">
                <BaseBadge :tone="categoryToneMap[item.category] || 'neutral'">
                  {{ categoryLabelMap[item.category] || item.category }}
                </BaseBadge>
                <h3 class="announcement-title">{{ item.title }}</h3>
              </div>
              <p class="announcement-intro">{{ item.intro }}</p>
            </div>
            <span class="card-summary-time">{{ item.time }}</span>
            <span class="expand-icon">▾</span>
          </button>

          <!-- Detail -->
          <div class="card-detail">
            <div class="detail-content">
              <template v-for="(block, bi) in item.content" :key="bi">
                <p v-if="block.type === 'text'">{{ block.content }}</p>
                <img v-else-if="block.type === 'image'" :src="block.content" loading="lazy" alt="">
                <div v-else-if="block.type === 'video' && parseBV(block.content)" class="video-embed-wrapper">
                  <iframe
                    :src="`https://player.bilibili.com/player.html?bvid=${parseBV(block.content)}&autoplay=0&high_quality=1`"
                    allowfullscreen
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    loading="lazy"
                  ></iframe>
                </div>
              </template>
            </div>
            <div class="detail-action-btn-row">
              <button
                type="button"
                :class="['btn-share', { shared: sharedId === generateAnchorId(item) }]"
                @click="shareItem(item, $event)"
              >
                {{ sharedId === generateAnchorId(item) ? '✓ 已复制链接' : '🔗 分享' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState v-else title="暂无公告" description="当前没有匹配的公告内容。" />
  </main>
</template>

<style scoped>
.announcements-hero {
  height: 35vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: var(--bl-header-height);
  background: url('https://img.lunadeer.cn/i/2025/11/26/69267755e14e3.png') center/cover no-repeat;
  position: relative;
  color: #fff;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.005em;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.announcements-container {
  max-width: 900px;
  padding: 40px 20px;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 32px;
  margin-top: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--bl-accent), rgba(0, 113, 227, 0.1));
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -32px;
  top: 28px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--bl-accent);
  z-index: 1;
}

.timeline-item.category-activity::before {
  border-color: var(--bl-green);
}

.timeline-item.category-maintenance::before {
  border-color: var(--bl-warning);
}

.timeline-item.category-other::before {
  border-color: var(--bl-purple);
}

/* Announcement Card */
.announcement-card {
  background: var(--bl-surface-strong);
  border-radius: var(--bl-radius-lg);
  box-shadow: var(--bl-shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: var(--bl-transition);
  cursor: pointer;
}

.announcement-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.announcement-card.expanded {
  cursor: default;
  transform: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.06);
}

.card-summary {
  width: 100%;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.announcement-card.expanded .card-summary {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to bottom, #fff, #fafafa);
}

.card-summary-main {
  flex: 1;
  min-width: 0;
}

.card-summary-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.announcement-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--bl-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-card.expanded .announcement-title {
  white-space: normal;
  overflow: visible;
}

.announcement-intro {
  font-size: 14px;
  color: var(--bl-text-secondary);
  margin: 4px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-card.expanded .announcement-intro {
  white-space: normal;
  overflow: visible;
}

.card-summary-time {
  font-size: 13px;
  color: var(--bl-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.expand-icon {
  color: var(--bl-text-secondary);
  font-size: 14px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  opacity: 0.4;
}

.announcement-card.expanded .expand-icon {
  transform: rotate(180deg);
  opacity: 0.6;
}

/* Detail */
.card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.25, 1, 0.5, 1), padding 0.35s ease;
  padding: 0 28px;
}

.announcement-card.expanded .card-detail {
  max-height: 2000px;
  padding: 28px 28px 32px;
}

.detail-content {
  line-height: 1.8;
  font-size: 15px;
  color: var(--bl-text);
}

.detail-content p {
  margin: 0 0 14px;
}

.detail-content p:last-child {
  margin-bottom: 0;
}

.detail-content img {
  max-width: 100%;
  border-radius: 12px;
  margin: 12px 0 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.video-embed-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 12px 0 16px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.video-embed-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.detail-action-btn-row {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: transparent;
  color: var(--bl-text-secondary);
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--bl-transition);
}

.btn-share:hover {
  color: var(--bl-accent);
  border-color: var(--bl-accent);
  background: rgba(0, 113, 227, 0.04);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .card-summary {
    flex-wrap: wrap;
    padding: 18px 20px;
  }

  .card-summary-time {
    width: 100%;
    margin-top: 4px;
  }

  .card-detail {
    padding-left: 20px;
    padding-right: 20px;
  }

  .announcement-card.expanded .card-detail {
    padding: 20px;
  }
}
</style>
