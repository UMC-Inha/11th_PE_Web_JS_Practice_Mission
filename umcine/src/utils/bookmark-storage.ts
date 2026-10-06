const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";

export function readBookmarkIds(defaultIds: number[] = []): number[] {
  const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);

  // 저장된 적이 한 번도 없는 경우(키 자체가 없어 null)에만 기본값을 쓴다.
  // 사용자가 전부 해제해서 "[]"가 저장된 경우는 "저장된 적 없음"과 달리 그 상태를 그대로 존중해야 함.
  if (storedValue === null) return defaultIds;
  if (!storedValue) return []; //빈 문자열처럼 비정상적으로 저장된 경우 JSON.parse 호출하지 않고 빈 배열 반환

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