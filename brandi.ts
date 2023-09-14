import axios from 'axios'
import type { Result, Review } from './types.js'
import { stringify } from 'querystring'
import { text } from 'stream/consumers'

async function extract(url: string) {
  const params = new URL(url).pathname.split('/')
  const itemId = params[2]

  const result: Result = []
  const limit = 5
  let offset = 0

  while (true) {
    const reviewURL = `https://brandi-api.brandi.biz/v2/web/products/${itemId}/reviews?version=2101&limit=5&offset=${offset}&tab-type=all`

    const reviews = await getReviews(reviewURL)

    result.push(...reviews)

    if (reviews.length === 0 || result.length > 200) break

    offset += limit
  }

  return result.slice(0, 200)
}

// //한 페이지 내 리뷰들
async function getReviews(url: string) {
  const reviews: Review[] = []

  const resp = await axios.get(url, {})
  const revArr: [
    {
      text: string
      user: {
        name: string
      }
      created_time: string
      evaluation: {
        satisfaction: string
      }
      images: [
        {
          image_url: string
        }
      ]
    }
  ] = resp.data.data

  for (let i = 0; i < revArr.length; i++) {
    const message = revArr[i].text
    const writer = revArr[i].user.name
    const date = timestamp(parseInt(revArr[i].created_time))
    const rate = revArr[i].evaluation.satisfaction
    const revImages = revArr[i].images
    const images = revImages ? revImages.map(e => e.image_url) : []
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

function timestamp(t: number) {
  const date = new Date(t * 1000)
  const year = String(date.getFullYear()).slice(2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

export { extract }
