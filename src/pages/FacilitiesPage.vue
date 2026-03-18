<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import FilterPanel from '../components/shared/FilterPanel.vue';
import BaseBadge from '../components/base/BaseBadge.vue';
import BaseModal from '../components/base/BaseModal.vue';
import ModalSection from '../components/detail/ModalSection.vue';
import EmptyState from '../components/base/EmptyState.vue';

const route = useRoute();

const facilities = ref([]);
const searchQuery = ref('');
const typeFilter = ref('all');
const dimensionFilter = ref('all');
const modalOpen = ref(false);
const selectedFacility = ref(null);
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
  fetch('/data/facilities.json')
    .then(r => r.json())
    .then(data => {
      facilities.value = data;
      nextTick(() => handleHash());
    });
});

function handleHash() {
  const hash = route.hash.replace('#', '');
  if (!hash) return;
  const match = facilities.value.find(item => generateId(item) === hash);
  if (match) openModal(match);
}

function generateId(item) {
  const raw = item.title || '';
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h) + raw.charCodeAt(i);
    h |= 0;
  }
  return 'f' + Math.abs(h).toString(36);
}

const typeOptions = [
  { value: 'all', label: '全部' },
  { value: 'resource', label: '资源' },
  { value: 'xp', label: '经验' },
  { value: 'infrastructure', label: '基建' },
];

const dimensionOptions = [
  { value: 'all', label: '全部' },
  { value: 'overworld', label: '主世界' },
  { value: 'nether', label: '下界' },
  { value: 'end', label: '末地' },
];

const typeTextMap = { resource: '资源', xp: '经验', infrastructure: '基建' };
const dimensionTextMap = { overworld: '主世界', nether: '下界', end: '末地' };
const statusTextMap = { online: '运行中', maintenance: '维护中', offline: '已停用' };
const statusToneMap = { online: 'success', maintenance: 'warning', offline: 'danger' };

const filtered = computed(() => {
  return facilities.value.filter(item => {
    const matchType = typeFilter.value === 'all' || item.type === typeFilter.value;
    const matchDim = dimensionFilter.value === 'all' || item.dimension === dimensionFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.intro.toLowerCase().includes(q);
    return matchType && matchDim && matchSearch;
  });
});

function openModal(item) {
  selectedFacility.value = item;
  modalOpen.value = true;
  history.replaceState(null, '', location.pathname + '#' + generateId(item));
}

function closeModal() {
  modalOpen.value = false;
  selectedFacility.value = null;
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
  const world = item.dimension === 'nether' ? 'world_nether' : item.dimension === 'end' ? 'world_the_end' : 'world';
  return `https://mcmap.lunadeer.cn/#${world}:${c.x}:${c.y}:${c.z}:500:0:0:0:1:flat`;
}

function parseBV(input) {
  if (!input) return null;
  const m = input.trim().match(/(BV[A-Za-z0-9]{10,})/);
  return m ? m[1] : null;
}

function onFilterChange({ key, value }) {
  if (key === 'type') typeFilter.value = value;
  if (key === 'dimension') dimensionFilter.value = value;
}
</script>

<template>
  <!-- Hero -->
  <section class="page-hero facilities-hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">全服共享资源</h1>
      <p class="hero-subtitle">共同建设，共同分享，让生存更轻松。</p>
    </div>
  </section>

  <main class="facilities-container bl-shell">
    <!-- Controls -->
    <FilterPanel
      title="设施列表"
      :search-value="searchQuery"
      search-placeholder="搜索设施名称或简介..."
      :filters="[
        { key: 'type', label: '类型', options: typeOptions, modelValue: typeFilter },
        { key: 'dimension', label: '维度', options: dimensionOptions, modelValue: dimensionFilter },
      ]"
      @update:search-value="searchQuery = $event"
      @change-filter="onFilterChange"
    />

    <!-- Grid -->
    <div v-if="filtered.length" class="facilities-grid">
      <article
        v-for="item in filtered"
        :key="generateId(item)"
        class="facility-card"
        @click="openModal(item)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ item.title }}</h3>
          <BaseBadge :tone="statusToneMap[item.status] || 'neutral'">
            {{ statusTextMap[item.status] || item.status }}
          </BaseBadge>
        </div>
        <p class="card-intro">{{ item.intro }}</p>
        <div class="card-meta">
          <span class="meta-tag">{{ typeTextMap[item.type] || item.type }}</span>
          <span class="meta-tag">{{ dimensionTextMap[item.dimension] || item.dimension }}</span>
        </div>
      </article>
    </div>

    <EmptyState v-else title="暂无设施" description="当前没有匹配的设施信息。" />

    <!-- Detail Modal -->
    <BaseModal :model-value="modalOpen" width="720px" @update:model-value="closeModal">
      <template v-if="selectedFacility" #header>
        <div class="modal-header-inner">
          <h3>{{ selectedFacility.title }}</h3>
          <p class="modal-intro">{{ selectedFacility.intro }}</p>
          <div class="modal-badges-row">
            <div class="modal-badges">
              <BaseBadge :tone="statusToneMap[selectedFacility.status]">
                {{ statusTextMap[selectedFacility.status] }}
              </BaseBadge>
              <BaseBadge tone="accent">
                {{ typeTextMap[selectedFacility.type] }}
              </BaseBadge>
            </div>
            <div class="modal-actions">
              <button
                type="button"
                :class="['btn-share', { shared: sharedId === generateId(selectedFacility) }]"
                @click="shareItem(selectedFacility)"
              >
                {{ sharedId === generateId(selectedFacility) ? '✓ 已复制' : '🔗 分享' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-if="selectedFacility">
        <ModalSection title="位置信息">
          <p>
            {{ dimensionTextMap[selectedFacility.dimension] }}
            <template v-if="selectedFacility.coordinates">
              · X: {{ selectedFacility.coordinates.x }}, Y: {{ selectedFacility.coordinates.y }}, Z: {{ selectedFacility.coordinates.z }}
            </template>
            <a
              v-if="selectedFacility.coordinates"
              :href="getMapUrl(selectedFacility)"
              target="_blank"
              rel="noopener"
              class="map-link"
            >
              🗺️ 在地图中查看
            </a>
          </p>
        </ModalSection>

        <ModalSection v-if="selectedFacility.contributors?.length" title="贡献 / 维护人员">
          <div class="contributors-list">
            <span v-for="name in selectedFacility.contributors" :key="name" class="contributor-tag">
              <img :src="`https://minotar.net/avatar/${name}/20`" :alt="name" loading="lazy">
              {{ name }}
            </span>
          </div>
        </ModalSection>

        <ModalSection v-if="selectedFacility.instructions?.length" title="使用说明">
          <div class="content-blocks">
            <template v-for="(block, bi) in selectedFacility.instructions" :key="bi">
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

        <ModalSection v-if="selectedFacility.notes?.length" title="注意事项">
          <div class="content-blocks">
            <template v-for="(block, bi) in selectedFacility.notes" :key="bi">
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
.facilities-hero {
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

.facilities-container {
  padding: 40px 20px;
}

/* Grid */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.facility-card {
  background: var(--bl-surface-strong);
  border-radius: var(--bl-radius-lg);
  padding: 24px;
  box-shadow: var(--bl-shadow-soft);
  transition: var(--bl-transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.facility-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--bl-shadow-card);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 10px;
  line-height: 1.3;
}

.card-intro {
  font-size: 14px;
  color: var(--bl-text-secondary);
  margin: 0 0 24px;
  line-height: 1.5;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 16px;
}

.meta-tag {
  font-size: 11px;
  background: #f5f5f7;
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--bl-text-secondary);
  font-weight: 500;
}

/* Modal Content */
.modal-header-inner h3 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.2;
}

.modal-intro {
  font-size: 18px;
  line-height: 1.6;
  color: var(--bl-text);
  margin: 0 0 20px;
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
  .facilities-grid { grid-template-columns: 1fr; }
  .modal-header-inner h3 { font-size: 24px; }
}
</style>
