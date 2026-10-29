import { springClient } from "../spring-client";

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

type GetMemberRatingsResponse = MemberRating[];

function getMemberRatings(memberId: number) {
  return springClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse, type MemberRating };
