//intex.ts에서 import해서 사용될거임
import { ReviewScraper } from './reviewScraper.js'
import { TenxTen } from './tenxten.js'
import { Ably } from './ably.js'
import { BlogPay } from './blogpay.js'
import { Brandi } from './brandi.js'

function typeCheck(url: URL): string {
  let type = 'null'

  if (url.host.includes('10x10')) {
    type = 'type_tenxten'
  } else if (url.host.includes('a-bly')) {
    type = 'type_ably'
  } else if (url.host.includes('blogpay')) {
    type = 'type_blogpay'
  } else if (url.host.includes('brandi')) {
    type = 'type_brandi'
  }

  return type
}

export async function reviewScraperFactory(
  url: string
): Promise<ReviewScraper> {
  let reviewUrl = new URL(url)
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
  }
}
