/** @deprecated Use services/compareService.js */
import { compareService } from '../services/compareService';

export { compareService };
export const getCompareList = () => compareService.getList();
export const saveCompareList = (list) => compareService.saveList(list);
export const isInCompareList = (id) => compareService.isInList(id);
export const toggleCompareCollege = (college) => compareService.toggle(college);
export const removeFromCompare = (id) => compareService.remove(id);
export const clearCompareList = () => compareService.clear();
