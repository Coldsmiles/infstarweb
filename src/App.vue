<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SiteNavbar from './components/layout/SiteNavbar.vue';
import SiteFooter from './components/layout/SiteFooter.vue';

const route = useRoute();

const navItems = [
  { label: '文档', href: '/doc' },
  { label: '地图', href: '/map' },
  { label: '设施', href: '/facilities' },
  { label: '城镇', href: '/towns' },
  { label: '公告', href: '/announcements' },
  { label: '相册', href: '/photo' },
  { label: '数据', href: '/stats' },
  { label: '状态', href: '/status' },
  { label: '赞助', href: '/sponsor' },
  { label: '群聊', href: 'https://qm.qq.com/q/6hLQs1Tx6g', external: true },
];

const activePath = computed(() => route.path);

// iframe pages don't show footer; they fill the viewport
const isIframePage = computed(() =>
  ['/doc', '/map', '/status', '/photo'].includes(route.path)
);

</script>

<template>
  <SiteNavbar :items="navItems" :active-path="activePath" />
  <router-view />
  <SiteFooter v-if="!isIframePage" />
</template>