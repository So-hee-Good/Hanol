import type { AppData } from "./types";
import { createSeedData } from "./seed";

export const STORAGE_KEY = "hanol-manager-sprint1-v2";

export function emptyData(): AppData {
  return {
    students: [],
    attendance: [],
    payments: [],
    smsHistory: [],
  };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return emptyData();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedData();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as AppData;
    return {
      students: parsed.students ?? [],
      attendance: parsed.attendance ?? [],
      payments: parsed.payments ?? [],
      smsHistory: parsed.smsHistory ?? [],
    };
  } catch {
    return createSeedData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData(): AppData {
  const seed = createSeedData();
  saveData(seed);
  return seed;
}
