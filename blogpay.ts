import axios from 'axios'
import { load } from 'cheerio'

import type { Result, Review } from './types.js'

async function extract(url: string): Promise<Result> {
  const params = new URL(url).searchParams
  const itemId = params.get('goodNum')
  const urlHost = new URL(url).host
  const result: Result = []
  let pageNo = 1

  while (true) {
    const reviewURL = `https://${urlHost}/good/product_view_goodrate_list?goodNum=${itemId}&page=${pageNo}`
    const reviews = await getReviews(reviewURL)

    result.push(...reviews)

    if (reviews.length === 0 || result.length > 200) {
      break
    }

    pageNo += 1
  }

  return result.slice(0, 200)
}

//한 페이지 내 리뷰들
async function getReviews(url: string): Promise<Review[]> {
  const reviews: Review[] = []

  const resp = await axios.get(url, {})
  const $ = load(resp.data)
  if ($('li.nolst-area').text().includes('없습니다')) return []

  const li = $('div.prod-review-item')

  li.each((i, e) => {
    const first = $(e).find('.prod-review-date')
    const writer = first.find('em').text().trim()
    const date = first.find('span').text().replace(/\./g, '/').slice(2)
    const rate = $(e).find('.star-rating-wrap > strong').text()

    const message = $(e).find('.prod-review-detail').text()

    const images = $(e)
      .find('.review-imgwrap > img')
      .toArray()
      .map(e => $(e).attr('src'))

    reviews.push({
      message,
      date,
      rate,
      writer,
      images,
    })
  })
  return reviews
}

// const result = await extract(
//   'https://juuvuv.shop.blogpay.co.kr/good/product_view?goodNum=203092667'
// )
// console.log(result)

export { extract }
