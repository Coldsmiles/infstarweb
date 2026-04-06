import { normalizeAnnouncementItem } from '../utils/announcements.js';

function normalizeAnnouncementsList(payload) {
  if (Array.isArray(payload)) {
    return payload.filter(Boolean);
  }

  if (Array.isArray(payload?.list)) {
    return payload.list.filter(Boolean);
  }

  if (Array.isArray(payload?.announcements?.list)) {
    return payload.announcements.list.filter(Boolean);
  }

  if (Array.isArray(payload?.announcements)) {
    return payload.announcements.filter(Boolean);
  }

  return [];
}

function normalizeAnnouncementsPayload(payload) {
  return {
    announcements: normalizeAnnouncementsList(payload)
      .map((item) => normalizeAnnouncementItem(item))
      .filter(Boolean),
  };
}

let announcementsRequest = null;

export function fetchAnnouncementsData(options = {}) {
  const { force = false } = options;

  if (force || !announcementsRequest) {
    announcementsRequest = fetch('/data/announcements.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load announcements: ${response.status}`);
        }

        return response.json();
      })
      .then(normalizeAnnouncementsPayload)
      .catch((error) => {
        announcementsRequest = null;
        throw error;
      });
  }

  return announcementsRequest.then(({ announcements }) => ({
    announcements: [...announcements],
  }));
}