import { ReviewScraper } from './reviewScraper.js'
import type { Result, Review } from './types.js'
import axios from 'axios'
import { load } from 'cheerio'

export class TenxTen implements ReviewScraper {
  url: URL

  constructor(url: URL) {
    this.url = url
  }

  async scrap() {
    const params = this.url.searchParams
    const itemId = params.get('itemid')

    const result: Result = []
    let pageNo = 1

    while (true) {
      const reviewURL = `http://www.10x10.co.kr/shopping/act_itemEvaluate.asp?itemid=${itemId}&sortMtd=ne&itemoption=&page=${pageNo}&evaldiv=a`
      const reviews = await this.getReviews(reviewURL)
      result.push(...reviews)
      if (reviews.length === 0 || result.length > 200) {
        break
      }
      pageNo += 1
    }
    return result.slice(0, 200)
  }

  async getReviews(reviewURL: string) {
    const reviews: Review[] = []

    const resp = await axios.get(reviewURL, {})
    const $ = load(resp.data)
    if ($('.noData').length !== 0) return []

    const trs = $('tbody tr:not([class])')

    trs.each((i, e) => {
      const first = $(e)
      const second = $(e).next('.talkMore')
      const writer = first.find('td').eq(3).text().trim()
      const date = first.find('td').eq(2).text().trim().slice(2)

      //범위 초과하여 참조 시 오류 발생 -> 해결하기 위해 조건문 사용
      const rateText = first.find('img').attr('alt') || ''
      const rateMatch = rateText.match(/\d+/)
      const rate = rateMatch ? rateMatch[0] : ''

      const message = second.find('p').text()

      const images = second
        .find('.imgArea > img')
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
}
