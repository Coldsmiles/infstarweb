import { ref, nextTick } from 'vue';

/**
 * Composable for sortable content block lists (text/image/video)
 * with drag-and-drop reordering.
 */
export function useSortableList(initialItems = []) {
  const items = ref(initialItems.map(i => ({ ...i })));

  function reset(newItems = []) {
    items.value = newItems.map(i => ({ ...i }));
  }

  function addItem(type) {
    items.value.push({ type, content: '' });
  }

  function removeItem(idx) {
    items.value.splice(idx, 1);
  }

  function updateContent(idx, content) {
    items.value[idx].content = content;
  }

  function moveItem(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    const [moved] = items.value.splice(fromIdx, 1);
    items.value.splice(toIdx, 0, moved);
  }

  function getCleanItems() {
    return items.value
      .filter(i => i.content.trim() !== '')
      .map(i => ({ type: i.type, content: i.content.trim() }));
  }

  return { items, reset, addItem, removeItem, updateContent, moveItem, getCleanItems };
}

/**
 * Composable for tag-style input (e.g. contributor names).
 */
export function useTagsInput(initialTags = []) {
  const tags = ref([...initialTags]);

  function reset(newTags = []) {
    tags.value = [...newTags];
  }

  function addTag(value) {
    const v = value.trim();
    if (v && !tags.value.includes(v)) {
      tags.value.push(v);
    }
  }

  function removeTag(idx) {
    tags.value.splice(idx, 1);
  }

  return { tags, reset, addTag, removeTag };
}
