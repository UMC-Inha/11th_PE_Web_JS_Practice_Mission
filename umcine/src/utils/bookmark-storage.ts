const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(): number[] {
  const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  if (!storedValue) return []; //값이 없거나 빈 문자열일 경우 JSON.parse 호출하지 않고 빈 배열 반환

  try { //try-catch로 잘못된 형식 방지
    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return []; //실제 Array 인 경우만 넘어감
    	
    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" && //값이 숫자이고
        Number.isInteger(movieId) && //정수이며
        movieId > 0, //양수여야 함
    );
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]) {
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
}