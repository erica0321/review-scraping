import type { Result, Review } from './types.js'

export interface ReviewScraper {
  url: URL
  scrap(): Promise<Result>
}
