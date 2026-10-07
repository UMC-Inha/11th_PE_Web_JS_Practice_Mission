const STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(): number[] {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(
        (id) => typeof id === "number" && Number.isInteger(id) && id > 0,
      )
    ) {
      return [];
    }

    return [...new Set<number>(parsedValue)];
  } catch {
    return [];
  }
}

export function saveBookmarkIds(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    console.warn("북마크를 브라우저에 저장하지 못했어요.");
  }
}