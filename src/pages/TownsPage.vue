<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import FilterPanel from '../components/shared/FilterPanel.vue';
import BaseBadge from '../components/base/BaseBadge.vue';
import BaseModal from '../components/base/BaseModal.vue';
import ModalSection from '../components/detail/ModalSection.vue';
import EmptyState from '../components/base/EmptyState.vue';

const route = useRoute();

const DEFAULT_GRADIENT = { from: '#667eea', to: '#764ba2' };

const towns = ref([]);
const searchQuery = ref('');
const scaleFilter = ref('all');
const typeFilter = ref('all');
const recruitFilter = ref('all');
const modalOpen = ref(false);
const selectedTown = ref(null);
const sharedId = ref(null);
const editMode = ref(false);

// Secret edit shortcut
let secretBuffer = '';
function onSecretKey(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  secretBuffer += e.key.toLowerCase();
  if (secretBuffer.length > 4) secretBuffer = secretBuffer.slice(-4);
  if (secretBuffer === 'edit') { editMode.value = !editMode.value; secretBuffer = ''; }
}

onMounted(() => {
  document.addEventListener('keydown', onSecretKey);
  fetch('/data/towns.json')
    .then(r => r.json())
    .then(data => {
      towns.value = data;
      nextTick(() => handleHash());
    });
});

function handleHash() {
  const hash = route.hash.replace('#', '');
  if (!hash) return;
  const match = towns.value.find(item => generateId(item) === hash);
  if (match) openModal(match);
}

function generateId(item) {
  const raw = item.title || '';
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h) + raw.charCodeAt(i);
    h |= 0;
  }
  return 't' + Math.abs(h).toString(36);
}

// Filter options
const scaleOptions = [
  { value: 'all', label: '全部' },
  { value: 'small', label: '小型' },
  { value: 'medium', label: '中型' },
  { value: 'large', label: '大型' },
];

const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'building', label: '建筑' },
  { value: 'adventure', label: '冒险' },
  { value: 'industry', label: '工业' },
];

const recruitOptions = [
  { value: 'all', label: '全部' },
  { value: 'welcome', label: '欢迎加入' },
  { value: 'maybe', label: '可以考虑' },
  { value: 'closed', label: '暂不招人' },
];

// Maps
const scaleTextMap = { small: '小型（5人以下）', medium: '中型（2-10人）', large: '大型（10人以上）' };
const scaleIconMap = { small: 'fa-user', medium: 'fa-users', large: 'fa-city' };
const typeTextMap = { building: '建筑', adventure: '冒险', industry: '工业' };
const typeIconMap = { building: 'fa-building', adventure: 'fa-dragon', industry: 'fa-industry' };
const recruitTextMap = { welcome: '欢迎加入', closed: '暂不招人', maybe: '可以考虑' };
const recruitIconMap = { welcome: 'fa-door-open', closed: 'fa-door-closed', maybe: 'fa-question-circle' };
const dimensionTextMap = { overworld: '主世界', nether: '下界', the_end: '末地' };

function getGradient(item) {
  const g = item?.gradient || {};
  const from = /^#[0-9a-fA-F]{6}$/.test((g.from || '').trim()) ? g.from.trim() : DEFAULT_GRADIENT.from;
  const to = /^#[0-9a-fA-F]{6}$/.test((g.to || '').trim()) ? g.to.trim() : DEFAULT_GRADIENT.to;
  return { from, to };
}

function gradientStyle(item) {
  const g = getGradient(item);
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`;
}

const filtered = computed(() => {
  return towns.value.filter(item => {
    const matchScale = scaleFilter.value === 'all' || item.scale === scaleFilter.value;
    const matchType = typeFilter.value === 'all' || item.townType === typeFilter.value;
    const matchRecruit = recruitFilter.value === 'all' || item.recruitment === recruitFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || item.title.toLowerCase().includes(q);
    return matchScale && matchType && matchRecruit && matchSearch;
  });
});

function openModal(item) {
  selectedTown.value = item;
  modalOpen.value = true;
  history.replaceState(null, '', location.pathname + '#' + generateId(item));
}

function closeModal() {
  modalOpen.value = false;
  selectedTown.value = null;
  history.replaceState(null, '', location.pathname + location.search);
}

function shareItem(item) {
  const id = generateId(item);
  const url = location.origin + location.pathname + '#' + id;
  navigator.clipboard.writeText(url).then(() => {
    sharedId.value = id;
    setTimeout(() => { sharedId.value = null; }, 2000);
  });
}

function getMapUrl(item) {
  if (!item.coordinates) return '#';
  const c = item.coordinates;
  const d = item.dimension || 'overworld';
  const world = d === 'nether' ? 'world_nether' : d === 'the_end' ? 'world_the_end' : 'world';
  return `https://mcmap.lunadeer.cn/#${world}:${c.x}:${c.y}:${c.z}:500:0:0:0:1:flat`;
}

function parseBV(input) {
  if (!input) return null;
  const m = input.trim().match(/(BV[A-Za-z0-9]{10,})/);
  return m ? m[1] : null;
}

function onFilterChange({ key, value }) {
  if (key === 'scale') scaleFilter.value = value;
  if (key === 'type') typeFilter.value = value;
  if (key === 'recruit') recruitFilter.value = value;
}

function hasLogo(item) {
  return item.logo && item.logo.trim() !== '';
}
</script>

<template>
  <!-- Hero -->
  <section class="page-hero towns-hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">聚落与城镇</h1>
      <p class="hero-subtitle">探索服务器中的社区据点</p>
    </div>
  </section>

  <main class="towns-container bl-shell">
    <!-- Controls -->
    <FilterPanel
      title="城镇列表"
      :search-value="searchQuery"
      search-placeholder="搜索城镇名称..."
      :filters="[
        { key: 'scale', label: '规模', options: scaleOptions, modelValue: scaleFilter },
        { key: 'type', label: '类型', options: typeOptions, modelValue: typeFilter },
        { key: 'recruit', label: '招募', options: recruitOptions, modelValue: recruitFilter },
      ]"
      @update:search-value="searchQuery = $event"
      @change-filter="onFilterChange"
    />

    <!-- Grid -->
    <div v-if="filtered.length" class="towns-grid">
      <article
        v-for="item in filtered"
        :key="generateId(item)"
        class="town-card"
        @click="openModal(item)"
      >
        <div
          class="town-card-bg"
          :class="{ 'no-logo': !hasLogo(item) }"
          :style="hasLogo(item)
            ? { backgroundImage: `url('${item.logo}')` }
            : { background: gradientStyle(item) }"
        >
          <i v-if="!hasLogo(item)" class="fas fa-city town-logo-placeholder"></i>
          <div class="town-card-icons">
            <span class="town-icon-badge" :class="'icon-scale-' + item.scale" :title="scaleTextMap[item.scale]">
              <i class="fas" :class="scaleIconMap[item.scale]"></i>
            </span>
            <span class="town-icon-badge" :class="'icon-type-' + item.townType" :title="typeTextMap[item.townType]">
              <i class="fas" :class="typeIconMap[item.townType]"></i>
            </span>
            <span class="town-icon-badge" :class="'icon-recruit-' + item.recruitment" :title="recruitTextMap[item.recruitment]">
              <i class="fas" :class="recruitIconMap[item.recruitment]"></i>
            </span>
          </div>
        </div>
        <div class="town-card-body">
          <h3 class="town-card-title">{{ item.title }}</h3>
          <div class="town-card-meta">
            <span class="town-meta-tag"><i class="fas" :class="scaleIconMap[item.scale]"></i> {{ scaleTextMap[item.scale] }}</span>
            <span class="town-meta-tag"><i class="fas" :class="typeIconMap[item.townType]"></i> {{ typeTextMap[item.townType] }}</span>
            <span class="town-meta-tag"><i class="fas" :class="recruitIconMap[item.recruitment]"></i> {{ recruitTextMap[item.recruitment] }}</span>
          </div>
        </div>
      </article>
    </div>

    <EmptyState v-else title="暂无城镇" description="当前没有匹配的城镇信息。" />

    <!-- Detail Modal -->
    <BaseModal :model-value="modalOpen" width="720px" @update:model-value="closeModal">
      <template v-if="selectedTown" #header>
        <!-- Banner -->
        <div
          class="town-modal-banner"
          :class="{ 'no-logo': !hasLogo(selectedTown) }"
          :style="hasLogo(selectedTown)
            ? { backgroundImage: `url('${selectedTown.logo}')` }
            : { background: gradientStyle(selectedTown) }"
        >
          <i v-if="!hasLogo(selectedTown)" class="fas fa-city town-banner-placeholder"></i>
        </div>
        <div class="modal-header-inner">
          <h3>{{ selectedTown.title }}</h3>
          <div class="modal-badges-row">
            <div class="modal-badges">
              <span class="town-badge" :class="'badge-scale-' + selectedTown.scale">
                <i class="fas" :class="scaleIconMap[selectedTown.scale]"></i>
                {{ scaleTextMap[selectedTown.scale] }}
              </span>
              <span class="town-badge" :class="'badge-type-' + selectedTown.townType">
                <i class="fas" :class="typeIconMap[selectedTown.townType]"></i>
                {{ typeTextMap[selectedTown.townType] }}
              </span>
              <span class="town-badge" :class="'badge-recruit-' + selectedTown.recruitment">
                <i class="fas" :class="recruitIconMap[selectedTown.recruitment]"></i>
                {{ recruitTextMap[selectedTown.recruitment] }}
              </span>
            </div>
            <div class="modal-actions">
              <button
                type="button"
                :class="['btn-share', { shared: sharedId === generateId(selectedTown) }]"
                @click="shareItem(selectedTown)"
              >
                {{ sharedId === generateId(selectedTown) ? '✓ 已复制' : '🔗 分享' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-if="selectedTown">
        <!-- Location -->
        <ModalSection title="位置信息">
          <p v-if="selectedTown.coordinatesSecret">保密</p>
          <p v-else>
            {{ dimensionTextMap[selectedTown.dimension] || '主世界' }}
            <template v-if="selectedTown.coordinates">
              · X: {{ selectedTown.coordinates.x }}, Y: {{ selectedTown.coordinates.y }}, Z: {{ selectedTown.coordinates.z }}
            </template>
            <a
              v-if="selectedTown.coordinates"
              :href="getMapUrl(selectedTown)"
              target="_blank"
              rel="noopener"
              class="map-link"
            >
              🗺️ 在地图中查看
            </a>
          </p>
        </ModalSection>

        <!-- Founders -->
        <ModalSection title="创始人">
          <div v-if="selectedTown.founders?.length" class="contributors-list">
            <span v-for="name in selectedTown.founders" :key="name" class="contributor-tag">
              <img :src="`https://minotar.net/avatar/${encodeURIComponent(name)}/20`" :alt="name" loading="lazy">
              {{ name }}
            </span>
          </div>
          <span v-else class="text-secondary">暂无记录</span>
        </ModalSection>

        <!-- Members -->
        <ModalSection title="成员">
          <div v-if="selectedTown.members?.length" class="contributors-list">
            <span v-for="name in selectedTown.members" :key="name" class="contributor-tag">
              <img :src="`https://minotar.net/avatar/${encodeURIComponent(name)}/20`" :alt="name" loading="lazy">
              {{ name }}
            </span>
          </div>
          <span v-else class="text-secondary">暂无记录</span>
        </ModalSection>

        <!-- Introduction -->
        <ModalSection v-if="selectedTown.introduction?.length" title="城镇介绍">
          <div class="content-blocks">
            <template v-for="(block, bi) in selectedTown.introduction" :key="bi">
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
        </ModalSection>
      </template>
    </BaseModal>
  </main>
</template>

<style scoped>
.towns-hero {
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

.towns-container {
  padding: 40px 20px;
}

/* Grid */
.towns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

/* Card */
.town-card {
  border-radius: var(--bl-radius-lg);
  overflow: hidden;
  background: var(--bl-surface-strong);
  box-shadow: var(--bl-shadow-soft);
  cursor: pointer;
  transition: var(--bl-transition);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.town-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--bl-shadow-card);
}

.town-card-bg {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.town-card-bg.no-logo {
  background-size: unset;
}

.town-logo-placeholder {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.4);
}

.town-card-icons {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
}

.town-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 13px;
  backdrop-filter: blur(4px);
}

.town-card-body {
  padding: 18px 20px;
}

.town-card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
}

.town-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.town-meta-tag {
  font-size: 11px;
  background: #f5f5f7;
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--bl-text-secondary);
  font-weight: 500;
}

.town-meta-tag i {
  margin-right: 4px;
}

/* Modal banner */
.town-modal-banner {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: var(--bl-radius-lg) var(--bl-radius-lg) 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -32px -32px 20px;
  width: calc(100% + 64px);
}

.town-modal-banner.no-logo {
  background-size: unset;
}

.town-banner-placeholder {
  font-size: 64px;
  color: rgba(255, 255, 255, 0.35);
}

.modal-header-inner h3 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.2;
}

.modal-badges-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.modal-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.modal-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* Town badges */
.town-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.town-badge i {
  font-size: 12px;
}

.badge-scale-small { background: #e8f5e9; color: #2e7d32; }
.badge-scale-medium { background: #e3f2fd; color: #1565c0; }
.badge-scale-large { background: #fce4ec; color: #c62828; }
.badge-type-building { background: #fff3e0; color: #e65100; }
.badge-type-adventure { background: #f3e5f5; color: #6a1b9a; }
.badge-type-industry { background: #e0f2f1; color: #00695c; }
.badge-recruit-welcome { background: #e8f5e9; color: #2e7d32; }
.badge-recruit-closed { background: #ffebee; color: #c62828; }
.badge-recruit-maybe { background: #fff8e1; color: #f57f17; }

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
}

.btn-share.shared {
  color: #15803d;
  border-color: var(--bl-green);
  background: #e8fceb;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  background: var(--bl-accent);
  padding: 6px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  margin-left: 12px;
  transition: 0.2s;
}

.map-link:hover {
  background: var(--bl-accent-strong);
  transform: translateY(-1px);
}

.contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.contributor-tag {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #eee;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 14px;
  color: var(--bl-text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.contributor-tag img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
  background: #eee;
}

.text-secondary {
  color: var(--bl-text-secondary);
  font-size: 14px;
}

.content-blocks {
  background: #f9f9fa;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.content-blocks p {
  font-size: 15px;
  margin: 0 0 12px;
  line-height: 1.7;
}

.content-blocks p:last-child {
  margin-bottom: 0;
}

.content-blocks img {
  max-width: 100%;
  border-radius: 12px;
  margin: 12px 0 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.video-embed-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin: 12px 0 20px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.video-embed-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .hero-title { font-size: 36px; }
  .hero-subtitle { font-size: 20px; }
  .towns-grid { grid-template-columns: 1fr; }
  .modal-header-inner h3 { font-size: 24px; }
  .town-modal-banner { height: 140px; }
}
</style>
