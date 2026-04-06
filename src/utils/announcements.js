export const ANNOUNCEMENT_CATEGORY_META = {
  activity: {
    label: '活动',
    iconClass: 'fas fa-calendar-check',
  },
  maintenance: {
    label: '维护',
    iconClass: 'fas fa-wrench',
  },
  other: {
    label: '其他',
    iconClass: 'fas fa-info-circle',
  },
};

export const ANNOUNCEMENT_MARQUEE_ROW_HEIGHT = 38;
export const ANNOUNCEMENT_MARQUEE_ROW_GAP = 0;
export const ANNOUNCEMENT_OPEN_EVENT = 'bl:announcement-open';
export const ANNOUNCEMENTS_ROUTE_PATH = '/announcements';

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function generateAnnouncementAnchorId(item) {
  const raw = `${normalizeText(item?.time)}_${normalizeText(item?.title)}`;
  let hash = 0;

  for (let index = 0; index < raw.length; index += 1) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(index);
    hash |= 0;
  }

  return `a${Math.abs(hash).toString(36)}`;
}

export function normalizeAnnouncementItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const category = Object.hasOwn(ANNOUNCEMENT_CATEGORY_META, item.category)
    ? item.category
    : 'other';

  const normalized = {
    ...item,
    title: normalizeText(item.title),
    intro: normalizeText(item.intro),
    time: normalizeText(item.time),
    category,
    marquee: Boolean(item.marquee),
    content: Array.isArray(item.content) ? item.content.filter(Boolean) : [],
  };

  return {
    ...normalized,
    anchorId: generateAnnouncementAnchorId(normalized),
  };
}

export function groupAnnouncementMarquees(announcements) {
  return Object.keys(ANNOUNCEMENT_CATEGORY_META)
    .map((category) => ({
      category,
      items: announcements.filter((item) => item?.marquee && item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function getAnnouncementMarqueeHeight(groupCount) {
  if (!groupCount) {
    return '0px';
  }

  const totalHeight = (groupCount * ANNOUNCEMENT_MARQUEE_ROW_HEIGHT)
    + ((groupCount - 1) * ANNOUNCEMENT_MARQUEE_ROW_GAP);

  return `${totalHeight}px`;
}