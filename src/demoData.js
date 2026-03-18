export const navItems = [
  { label: '文档', href: '/doc.html' },
  { label: '地图', href: '/map.html' },
  { label: '设施', href: '/facilities.html' },
  { label: '城镇', href: '/towns.html' },
  { label: '公告', href: '/announcements.html' },
  { label: '相册', href: '/photo.html' },
  { label: '数据', href: '/stats.html' },
  { label: '赞助', href: '/sponsor.html' },
];

export const facilityItems = [
  {
    id: 'gold-farm',
    title: '猪灵金粒塔',
    intro: '映射自 facilities 页面标准卡片，主打高吞吐产能与低学习成本。',
    status: 'online',
    statusLabel: '运行中',
    type: '资源',
    dimension: '下界',
    location: '下界 420 / 128 / -180，临近地狱交通干道。',
    meta: ['下界', '高产出', '公共'],
    contributors: ['LunaDeer', 'Aster', 'Moka'],
    instructions: '站在指定 AFK 平台即可，战利品统一进入分拣区。',
    notes: '请勿修改开关状态，离开前确认背包已清理。',
  },
  {
    id: 'ice-highway',
    title: '主世界冰船高速',
    intro: '保留旧站设施卡片的低密度信息结构，但统一卡片圆角、阴影和标签。',
    status: 'maintenance',
    statusLabel: '维护中',
    type: '基建',
    dimension: '主世界',
    location: '主世界 0 / 90 / 0 起点，贯穿主要城镇枢纽。',
    meta: ['主世界', '导航', '联通'],
    contributors: ['Kite', 'Reimu'],
    instructions: '使用冰船沿路牌导航，支线入口保持单向通行。',
    notes: '正在更换部分分叉节点，请留意现场提示。',
  },
];

export const townItems = [
  {
    id: 'new-horizon',
    title: '新曙光港',
    intro: '大型海港型城镇，强调公共建筑与社区活动。',
    scale: '大型',
    recruitment: '欢迎加入',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    quickBadges: ['大', '建', '招'],
    meta: ['海港', '工业', '社区活动'],
    location: '主世界 1820 / 76 / -660，地图港湾边缘。',
    founders: ['LunaDeer', 'Hoshino'],
    members: ['Kite', 'Moka', 'Sora', 'Yui'],
    description: '城镇主打海港景观与工坊区联动，欢迎偏好合作建造与公共项目的玩家。',
  },
  {
    id: 'pinefield',
    title: '松野平原',
    intro: '中型聚落，擅长农业与景观建造，氛围稳定安静。',
    scale: '中型',
    recruitment: '可以考虑',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    quickBadges: ['中', '农', '待'],
    meta: ['田园', '建筑', '合作'],
    location: '主世界 -940 / 72 / 1330，松林与平原交界。',
    founders: ['Aster'],
    members: ['Mika', 'Ari', 'Shino'],
    description: '以大面积农田、温室与木构住宅区为核心，适合慢节奏玩家。',
  },
];

export const announcementItems = [
  {
    id: 'spring-festival',
    category: 'activity',
    categoryLabel: '活动',
    time: '2026-03-18',
    title: '春季建筑节开启报名',
    intro: '时间线卡片保留旧站公告页的摘要 + 展开正文交互。',
    content: [
      { title: '活动内容', body: '以“港口与交通”为主题，自由组队完成建筑作品。' },
      { title: '奖励说明', body: '前三名可获得纪念头颅、展示位与服务器鸣谢。' },
    ],
  },
  {
    id: 'nether-maintenance',
    category: 'maintenance',
    categoryLabel: '维护',
    time: '2026-03-12',
    title: '下界交通网维护窗口',
    intro: '将在周末凌晨进行区块清理与路标补全，期间部分支线不可用。',
    content: [
      { title: '维护范围', body: '主下界站与三条分支高速。' },
      { title: '玩家影响', body: '维护期间建议改用主世界驿站传送。' },
    ],
  },
];

export const leaderboardBoards = [
  {
    title: '总在线时长',
    subtitle: '映射自 stats 页面排行卡模式',
    icon: '⌛',
    color: '#ffd700',
    top: { name: 'LunaDeer', value: '1,248h' },
    entries: [
      { rank: 2, name: 'Aster', value: '1,102h' },
      { rank: 3, name: 'Kite', value: '963h' },
      { rank: 4, name: 'Moka', value: '881h' },
    ],
  },
  {
    title: '建筑方块放置',
    subtitle: '保留彩色顶部强调，但统一结构',
    icon: '▣',
    color: '#9b59b6',
    top: { name: 'Hoshino', value: '84.3k' },
    entries: [
      { rank: 2, name: 'Shino', value: '73.1k' },
      { rank: 3, name: 'Mika', value: '68.9k' },
      { rank: 4, name: 'Ari', value: '61.2k' },
    ],
  },
];

export const playerItems = [
  {
    id: 'luna',
    name: 'LunaDeer',
    avatar: 'https://minotar.net/helm/LunaDeer/160.png',
    uuid: '00000000-0000-0000-0009-01f0198a2ae4',
    highlights: [
      { label: '在线', value: '1248h' },
      { label: '放置', value: '84k' },
      { label: '死亡', value: '18' },
    ],
    details: [
      { label: '行走距离', value: '1,204 km' },
      { label: '方块放置', value: '84,301' },
      { label: '方块挖掘', value: '72,044' },
      { label: '总死亡', value: '18' },
      { label: '击杀数', value: '2,381' },
      { label: '在线时长', value: '1,248 小时' },
    ],
  },
  {
    id: 'aster',
    name: 'Aster',
    avatar: 'https://minotar.net/helm/Aster/160.png',
    uuid: '00000000-0000-0000-0009-01f02c512c19',
    highlights: [
      { label: '在线', value: '1102h' },
      { label: '放置', value: '73k' },
      { label: '死亡', value: '25' },
    ],
    details: [
      { label: '行走距离', value: '986 km' },
      { label: '方块放置', value: '73,120' },
      { label: '方块挖掘', value: '58,004' },
      { label: '总死亡', value: '25' },
      { label: '击杀数', value: '1,487' },
      { label: '在线时长', value: '1,102 小时' },
    ],
  },
];

export const donationItems = [
  {
    name: 'Moka',
    message: '用于升级世界备份磁盘与日志归档空间。',
    project: '存储扩容',
    amount: '¥288',
    time: '2026-03-15',
  },
  {
    name: 'Kite',
    message: '支持活动服务器与小游戏区维护。',
    project: '活动专项',
    amount: '¥168',
    time: '2026-03-10',
  },
];

export const bentoItems = [
  {
    title: '纯净原版',
    description: '无破坏平衡的重型插件，尽量贴近单机原版体验。',
    icon: '✦',
    size: 'large',
    background: 'linear-gradient(135deg, rgba(59,130,246,0.92), rgba(34,197,94,0.82))',
  },
  {
    title: '深度自研',
    description: '核心逻辑自主维护，页面与服务端体验可持续迭代。',
    icon: '⌘',
    size: 'medium',
    background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(29,78,216,0.78))',
  },
  {
    title: '原汁原味',
    description: '生成、红石与生态参数保持克制调整。',
    icon: '◇',
    size: 'medium',
    background: 'linear-gradient(135deg, rgba(245,158,11,0.92), rgba(249,115,22,0.82))',
  },
  {
    title: '免费圈地',
    description: '2048*2048 超大领地',
    icon: '⌂',
    size: 'small',
    background: 'linear-gradient(135deg, rgba(14,165,233,0.88), rgba(37,99,235,0.78))',
  },
  {
    title: '基岩互通',
    description: '手机电脑随时畅玩',
    icon: '◫',
    size: 'small',
    background: 'linear-gradient(135deg, rgba(244,63,94,0.88), rgba(190,24,93,0.78))',
  },
  {
    title: '自有硬件',
    description: '物理工作站，稳定运行',
    icon: '▤',
    size: 'small',
    background: 'linear-gradient(135deg, rgba(71,85,105,0.88), rgba(15,23,42,0.82))',
  },
  {
    title: '娱乐玩法',
    description: '空岛、跑酷与活动副本并存',
    icon: '◈',
    size: 'small',
    background: 'linear-gradient(135deg, rgba(16,185,129,0.88), rgba(5,150,105,0.82))',
  },
];

export const joinDevices = [
  { id: 'pc', name: 'PC / Java', icon: '⌘', description: '适合完整原版与红石体验。' },
  { id: 'ios', name: 'iOS / 基岩', icon: '◫', description: '移动端快速加入与语音社交。' },
  { id: 'android', name: 'Android / 基岩', icon: '▣', description: '便携游玩，适合碎片化上线。' },
];

export const playstyles = [
  { id: 'town', name: '城镇共建', icon: '⌂', description: '适合喜欢合作建造、分工和社区运营的玩家。' },
  { id: 'industry', name: '工业设施', icon: '▤', description: '偏向农场、物流与高效率自动化。' },
  { id: 'friends', name: '朋友联机', icon: '◎', description: '以小团体长期生存和轻社交为主。' },
  { id: 'solo', name: '独狼探索', icon: '◇', description: '更注重远行、冒险与个人节奏。' },
];

export const sponsorSummary = {
  title: '支持白鹿原服务器',
  description: '延续 sponsor 页面的大额中心化弹窗结构，但把信息整理为更清晰的摘要和行动区。',
  total: '¥42,680',
  supporters: '187',
};