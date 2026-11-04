import { springClient } from "../spring-client";

// 204 응답은 본문이 없으므로 .json()을 호출하지 않는다
async function deleteRating(memberId: number, ratingId: number) {
  await springClient.delete(`members/${memberId}/ratings/${ratingId}`);
}

export { deleteRating };
