
import type { StateStorage } from "zustand/middleware";
export const browserStorage: StateStorage = {
  getItem(name) {
    if (typeof window === "undefined") return null;
    try {
      const value = window.localStorage.getItem(name);
      if (value !== null) JSON.parse(value);
      return value;
    } catch { return null; }
  },
  setItem(name, value) {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(name, value); }
    catch { console.warn("브라우저에 데이터를 저장하지 못했어요."); }
  },
  removeItem(name) {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(name); }
    catch { console.warn("저장된 데이터를 지우지 못했어요."); }
  },
};
