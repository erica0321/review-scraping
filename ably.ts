import axios from 'axios'
import type { Result, Review } from './types.js'

async function extract(url: string): Promise<Result> {
  const params = new URL(url).pathname.split('/')
  const itemId = params[2]

  const reviewURL = `https://api.a-bly.com/webview/goods/${itemId}/reviews/`
  const reviews = await getReviews(reviewURL)

  return reviews
}

// //한 페이지 내 리뷰들
async function getReviews(url: string): Promise<Review[]> {
  const reviews: Review[] = []
  const resp = await axios.get(url, {})
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

export { extract }
