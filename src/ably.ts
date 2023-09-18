import { ReviewScraper } from './reviewScraper.js'
import type { Result, Review } from './types.js'
import axios from 'axios'

async function extract(url: URL): Promise<Result> {
  const params = url.pathname.split('/')
  const itemId = params[2]

  const reviewURL = `https://api.a-bly.com/webview/goods/${itemId}/reviews/`
  const reviews = await getReviews(reviewURL)

  return reviews
}

async function getReviews(reviewURL: string) {
  const reviews: Review[] = []
  const resp = await axios.get(reviewURL, {})
  const revArr = resp.data.reviews

  for (let i = 0; i < revArr.length; i++) {
    const message = revArr[i].contents.trim()
    const writer = revArr[i].writer
    const date = revArr[i].created_at.replace(/-/g, '/').slice(2, 10)
    const images = revArr[i].images
    const rate = ''

    reviews.push({
      message,
      date,
      rate,
      writer,
      images,
    })
  }

  return reviews
}

export class Ably implements ReviewScraper {
  url: URL

  constructor(url: URL) {
    this.url = url
  }

  async scrap() {
    return extract(this.url)
  }
}
