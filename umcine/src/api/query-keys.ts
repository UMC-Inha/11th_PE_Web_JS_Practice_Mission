export const queryKeys = {
  me: ["members", "me"] as const,
  favorites: ["favorites"] as const,
  favoriteStatus: (movieId: number) => ["favorites", movieId] as const,
  ratings: (memberId: number) => ["members", memberId, "ratings"] as const,
};
