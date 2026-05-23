/** Model layer — local compare basket persistence */
const STORAGE_KEY = 'compareList';
const MAX_COMPARE = 3;

export const compareService = {
  getList: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },
  saveList: (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list)),
  isInList: (collegeId) =>
    compareService.getList().some((item) => item.id === collegeId),
  toggle: (college) => {
    const list = compareService.getList();
    const exists = list.some((item) => item.id === college.id);
    if (exists) {
      const updated = list.filter((item) => item.id !== college.id);
      compareService.saveList(updated);
      return { list: updated, added: false };
    }
    if (list.length >= MAX_COMPARE) {
      return { list, added: false, error: 'You can compare a maximum of 3 colleges.' };
    }
    const updated = [...list, college];
    compareService.saveList(updated);
    return { list: updated, added: true };
  },
  remove: (collegeId) => {
    const updated = compareService.getList().filter((item) => item.id !== collegeId);
    compareService.saveList(updated);
    return updated;
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  },
};
