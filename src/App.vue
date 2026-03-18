<script setup>
import { computed, ref } from 'vue';
import {
  AnnouncementTimeline,
  BaseBadge,
  BaseButton,
  BaseCard,
  EmptyState,
  FacilityCard,
  FacilityDetailModal,
  FeatureBentoGrid,
  FilterPanel,
  JoinWizard,
  LeaderboardCard,
  LoadMoreButton,
  PageHero,
  PlayerCard,
  PlayerDetailModal,
  SiteFooter,
  SiteNavbar,
  SponsorModal,
  TownCard,
  TownDetailModal,
  DonationCard,
} from './components';
import {
  announcementItems,
  bentoItems,
  donationItems,
  facilityItems,
  joinDevices,
  leaderboardBoards,
  navItems,
  playerItems,
  playstyles,
  sponsorSummary,
  townItems,
} from './demoData';

const searchValue = ref('');
const selectedFacilityType = ref('all');
const selectedFacilityDimension = ref('all');

const facilityModalOpen = ref(false);
const townModalOpen = ref(false);
const playerModalOpen = ref(false);
const sponsorModalOpen = ref(false);

const activeFacility = ref(facilityItems[0]);
const activeTown = ref(townItems[0]);
const activePlayer = ref(playerItems[0]);

const filters = computed(() => [
  {
    key: 'type',
    label: '类型',
    modelValue: selectedFacilityType.value,
    options: [
      { value: 'all', label: '全部' },
      { value: '资源', label: '资源', icon: '◈' },
      { value: '基建', label: '基建', icon: '▤' },
    ],
  },
  {
    key: 'dimension',
    label: '维度',
    modelValue: selectedFacilityDimension.value,
    options: [
      { value: 'all', label: '全部' },
      { value: '主世界', label: '主世界' },
      { value: '下界', label: '下界' },
    ],
  },
]);

const filteredFacilities = computed(() => {
  const keyword = searchValue.value.trim().toLowerCase();

  return facilityItems.filter((item) => {
    const matchesKeyword = !keyword || `${item.title} ${item.intro}`.toLowerCase().includes(keyword);
    const matchesType = selectedFacilityType.value === 'all' || item.type === selectedFacilityType.value;
    const matchesDimension = selectedFacilityDimension.value === 'all' || item.dimension === selectedFacilityDimension.value;
    return matchesKeyword && matchesType && matchesDimension;
  });
});

const handleFilterChange = ({ key, value }) => {
  if (key === 'type') {
    selectedFacilityType.value = value;
  }

  if (key === 'dimension') {
    selectedFacilityDimension.value = value;
  }
};
</script>

<template>
  <div class="showcase-page">
    <SiteNavbar :items="navItems" active-path="/facilities.html" />

    <PageHero
      eyebrow="Vue UI Migration"
      title="白鹿原基础 UI 组件审查页"
      subtitle="已按旧站视觉语言重建共享布局、原子组件、内容卡片、时间线、向导与详情弹窗。这里仅展示组件，不迁移具体页面。"
    >
      <div class="hero-review-panel">
        <span class="bl-demo-chip">组件数 25+</span>
        <span class="bl-demo-chip">旧站风格保留</span>
        <span class="bl-demo-chip">Vue 组件化</span>
      </div>
    </PageHero>

    <main class="showcase-main bl-shell">
      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Layout + Base</p>
            <h2 class="bl-section-title">布局原语与基础控件</h2>
          </div>
          <p class="bl-section-copy">映射 old-html-ver/js/components.js 与全局 style.css，但统一了圆角、层次和交互状态。</p>
        </div>

        <div class="bl-grid bl-grid-3">
          <BaseCard>
            <h3>按钮</h3>
            <div class="button-row">
              <BaseButton>主要操作</BaseButton>
              <BaseButton variant="secondary">次要操作</BaseButton>
              <BaseButton variant="ghost">描边按钮</BaseButton>
            </div>
          </BaseCard>
          <BaseCard>
            <h3>状态徽章</h3>
            <div class="badge-row">
              <BaseBadge tone="accent">新模式</BaseBadge>
              <BaseBadge tone="success">运行中</BaseBadge>
              <BaseBadge tone="warning">维护中</BaseBadge>
              <BaseBadge tone="purple">公告</BaseBadge>
            </div>
          </BaseCard>
          <BaseCard>
            <h3>占位 / 分页</h3>
            <EmptyState title="组件预留位" description="后续页面迁移时可直接嵌入空状态与加载更多行为。" />
            <LoadMoreButton />
          </BaseCard>
        </div>
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Controls</p>
            <h2 class="bl-section-title">Search / Filter 标准模式</h2>
          </div>
          <p class="bl-section-copy">以 announcements / facilities / towns 的 controls-section 为 canonical pattern。</p>
        </div>

        <FilterPanel
          title="设施列表"
          :search-value="searchValue"
          search-placeholder="搜索设施标题或简介..."
          :filters="filters"
          action-label="新增设施"
          @update:search-value="searchValue = $event"
          @change-filter="handleFilterChange"
        />

        <div class="bl-grid bl-grid-2 cards-grid">
          <FacilityCard
            v-for="facility in filteredFacilities"
            :key="facility.id"
            :facility="facility"
            @click="activeFacility = facility; facilityModalOpen = true"
          />
        </div>
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Cards</p>
            <h2 class="bl-section-title">设施、城镇、玩家、赞助卡片</h2>
          </div>
          <p class="bl-section-copy">卡片结构按页面职责分化，但共用统一的 spacing、radius、shadow 和 interactive feedback。</p>
        </div>

        <div class="bl-grid bl-grid-2 cards-grid">
          <TownCard v-for="town in townItems" :key="town.id" :town="town" @click="activeTown = town; townModalOpen = true" />
        </div>

        <div class="bl-grid bl-grid-2 cards-grid">
          <LeaderboardCard v-for="board in leaderboardBoards" :key="board.title" :board="board" />
        </div>

        <div class="bl-grid bl-grid-4 cards-grid">
          <PlayerCard v-for="player in playerItems" :key="player.id" :player="player" @click="activePlayer = player; playerModalOpen = true" />
        </div>

        <div class="bl-grid bl-grid-2 cards-grid">
          <DonationCard v-for="donation in donationItems" :key="`${donation.name}-${donation.time}`" :donation="donation" />
        </div>
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Announcements</p>
            <h2 class="bl-section-title">公告时间线与展开卡片</h2>
          </div>
          <p class="bl-section-copy">保留时间线为专用模式，不强行套进设施 / 城镇列表卡布局。</p>
        </div>

        <AnnouncementTimeline :items="announcementItems" />
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Home</p>
            <h2 class="bl-section-title">首页 Bento 特性栅格</h2>
          </div>
          <p class="bl-section-copy">视觉延续旧首页的功能块式布局，但用统一组件和 data-driven 结构输出。</p>
        </div>

        <FeatureBentoGrid :items="bentoItems" />
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Join</p>
            <h2 class="bl-section-title">加入游戏向导</h2>
          </div>
          <p class="bl-section-copy">保留 Join 页面纵向步骤与选择卡片关系，但迁移为可复用状态组件。</p>
        </div>

        <JoinWizard :devices="joinDevices" :playstyles="playstyles" />
      </section>

      <section class="showcase-section">
        <div class="bl-section-heading">
          <div>
            <p class="showcase-kicker">Detail</p>
            <h2 class="bl-section-title">详情弹窗审查入口</h2>
          </div>
          <p class="bl-section-copy">详情弹窗以 facilities / towns 的 modal 结构为基底，stats / sponsor 作为特化实现。</p>
        </div>

        <BaseCard class="modal-launcher">
          <div class="button-row">
            <BaseButton @click="facilityModalOpen = true">查看设施详情</BaseButton>
            <BaseButton variant="secondary" @click="townModalOpen = true">查看城镇详情</BaseButton>
            <BaseButton variant="ghost" @click="playerModalOpen = true">查看玩家详情</BaseButton>
            <BaseButton variant="soft" @click="sponsorModalOpen = true">查看赞助弹窗</BaseButton>
          </div>
        </BaseCard>
      </section>
    </main>

    <SiteFooter />

    <FacilityDetailModal v-model="facilityModalOpen" :facility="activeFacility" />
    <TownDetailModal v-model="townModalOpen" :town="activeTown" />
    <PlayerDetailModal v-model="playerModalOpen" :player="activePlayer" />
    <SponsorModal v-model="sponsorModalOpen" :summary="sponsorSummary" />
  </div>
</template>

<style scoped>
.showcase-page {
  min-height: 100vh;
}

.showcase-main {
  padding: 40px 0 0;
}

.showcase-section {
  margin-top: 36px;
}

.showcase-kicker {
  margin: 0 0 10px;
  color: var(--bl-accent);
  font-size: 0.84rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
}

.hero-review-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button-row,
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cards-grid {
  margin-top: 22px;
}

.modal-launcher {
  margin-top: 8px;
}

.showcase-section :deep(h3) {
  margin: 0 0 12px;
}

@media (max-width: 840px) {
  .showcase-main {
    padding-top: 24px;
  }
}
</style>