import type { Result, Review } from './types.js'

export interface ReviewScraper {
  scrap(): Promise<Result>
}
