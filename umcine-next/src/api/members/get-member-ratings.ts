import { umcineClient } from "../umcine-client";
import type { RatingResponse } from "./models";

function getMemberRatings(memberId: number) {
  return umcineClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}

export { getMemberRatings };