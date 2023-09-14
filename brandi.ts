import axios from 'axios'
import type { Result, Review } from './types.js'

async function extract(url: string): Promise<Result> {
  const params = new URL(url).pathname.split('/')
  const itemId = params[2]

  const result: Result = []
  let pageNo = 0

  while (true) {
    const reviewURL = `https://brandi-api.brandi.biz/v2/web/products/${itemId}/reviews?version=2101&limit=5&offset=${pageNo}&tab-type=all`
    const reviews = await getReviews(reviewURL)

    result.push(...reviews)

    if (reviews.length === 0 || result.length > 200) break

    pageNo += 5
  }

  return result.slice(0, 200)
}

// //한 페이지 내 리뷰들
async function getReviews(url: string): Promise<Review[]> {
  const reviews: Review[] = []

  const resp = await axios.get(url, {})
  const revArr = resp.data.data

  for (let i = 0; i < revArr.length; i++) {
    const message = revArr[i].text
    const writer = revArr[i].user.name
    const date = timestamp(parseInt(revArr[i].created_time))
    const rate = revArr[i].evaluation.satisfaction
    const image = revArr[i].images
    const images = image ? [image[0].image_url] : []

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

function timestamp(t: number): string {
  const date = new Date(t * 1000)
  const year = date.getFullYear().toString().slice(2)
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)

  return `${year}/${month}/${day}`
}

export { extract }
