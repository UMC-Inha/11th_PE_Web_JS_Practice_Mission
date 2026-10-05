export type Movie = {
  id: number
  title: string
  originalTitle: string
  overview: string
  tagline: string
  posterPath: string
  backdropPath: string
  releaseDate: string
  genres: string[]
  runtime: number
  voteAverage: number
  isBookmarked?: boolean
}
