import type { Movie } from '../types/movie'

const POSTER_DIR = '/images/movies'
const BACKDROP_DIR = '/images/backdrops'

type MovieSeed = Pick<Movie, 'id' | 'title' | 'originalTitle' | 'releaseDate'> &
  Partial<Pick<Movie, 'overview' | 'tagline' | 'genres' | 'runtime'>> & {
    image: string
    // 배경 이미지가 따로 없으면 포스터를 배경으로 쓴다.
    backdrop?: string
    isBookmarked?: boolean
  }

const movieSeeds: MovieSeed[] = [
  {
    id: 1,
    title: '스파이더맨: 브랜드 뉴 데이',
    originalTitle: 'Spider-Man: Brand New Day',
    releaseDate: '2026.07.29',
    image: 'spider-man-brand-new-day.png',
    backdrop: 'spider-man-brand-new-day.png',
    tagline: '스파이더맨의 새로운 날을 확인하라!',
    overview:
      '4년 전 소중한 사람들을 지키기 위해 모두의 기억에서 사라진 피터 파커. 친절한 이웃 스파이더맨으로서 뉴욕을 지키며 고독한 삶을 살아가던 피터는 예상치 못한 DNA 변이와 자신의 정체를 아는 적을 마주한다.',
    genres: ['SF', '액션', '모험'],
    runtime: 145,
  },
  { id: 2, title: '오디세이', originalTitle: 'The Odyssey', releaseDate: '2026.08.05', image: 'the-odyssey.png', isBookmarked: true },
  { id: 3, title: '스파이더맨: 노 웨이 홈', originalTitle: 'Spider-Man: No Way Home', releaseDate: '2021.12.15', image: 'spider-man-no-way-home.png' },
  { id: 4, title: '라스트 하우스', originalTitle: 'Last House', releaseDate: '2026.08.07', image: 'last-house.png' },
  { id: 5, title: '미니언즈 & 몬스터즈', originalTitle: 'Minions & Monsters', releaseDate: '2026.07.15', image: 'minions-and-monsters.png' },
  { id: 6, title: '군체', originalTitle: 'Colony', releaseDate: '2026.05.21', image: 'colony.png' },
  { id: 7, title: '토이 스토리 5', originalTitle: 'Toy Story 5', releaseDate: '2026.06.17', image: 'toy-story-5.png', isBookmarked: true },
  { id: 8, title: '로빈 후드의 죽음', originalTitle: 'The Death of Robin Hood', releaseDate: '2026.06.18', image: 'the-death-of-robin-hood.png' },
  { id: 9, title: '이블 데드 번', originalTitle: 'Evil Dead Burn', releaseDate: '2026.07.07', image: 'evil-dead-burn.png' },
  { id: 10, title: '옵세션', originalTitle: 'Obsession', releaseDate: '2026.09.02', image: 'obsession.png' },
]

// 상세 정보(줄거리, 장르 등)가 없는 영화는 빈 값으로 둔다.
export const movies: Movie[] = movieSeeds.map(({ image, backdrop, ...movie }) => ({
  overview: '',
  tagline: '',
  genres: [],
  runtime: 0,
  ...movie,
  posterPath: `${POSTER_DIR}/${image}`,
  backdropPath: backdrop ? `${BACKDROP_DIR}/${backdrop}` : `${POSTER_DIR}/${image}`,
  voteAverage: 0,
}))
