//intex.ts에서 import해서 사용될거임
import { ReviewScraper } from './reviewScraper.js'
import { TenxTen } from './tenxten.js'
import { Ably } from './ably.js'
import { BlogPay } from './blogpay.js'
import { Brandi } from './brandi.js'
import { Result } from './types.js'

type ScraperType = 'type_tenxten' | 'type_ably' | 'type_blogpay' | 'type_brandi' | null

function typeCheck(url: URL): string {
  const host = url.host
  let type: ScraperType = null

  if (host.includes('10x10')) {
    type = 'type_tenxten'
  } else if (host.includes('a-bly')) {
    type = 'type_ably'
  } else if (host.includes('blogpay')) {
    type = 'type_blogpay'
  } else if (host.includes('brandi')) {
    type = 'type_brandi'
  }

  return type
}

export async function reviewScraperFactory(
  url: string
): Promise<ReviewScraper> {
  const reviewUrl = new URL(url)
  const type = typeCheck(reviewUrl)

  switch (type) {
    case 'type_ably':
      return new Ably(reviewUrl)
    case 'type_tenxten':
      return new TenxTen(reviewUrl)
    case 'type_blogpay':
      return new BlogPay(reviewUrl)
    case 'type_brandi':
      return new Brandi(reviewUrl)
    default:
      return new NullScraper(reviewUrl)
  }
}

class NullScraper implements ReviewScraper {
  private url: URL
  constructor(url: URL) {
    this.url = url
  }
  async scrap(): Promise<Result> {
    return []
  }
}
