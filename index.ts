import axios from 'axios'
import { load } from 'cheerio'

//리뷰들을 저장하는 곳
type Result = Review[]

//하나의 리뷰 type
type Review = {
  message: string
  date: string
  rate: string
  writer: string
  images: string[]
}

async function extract(url: string): Promise<Result> {
  const params = new URL(url).searchParams
  const itemId = params.get('itemid')

  const result: Result = []
  let pageNo = 1

  while (true) {
    const reviewURL = `http://www.10x10.co.kr/shopping/act_itemEvaluate.asp?itemid=${itemId}&sortMtd=ne&itemoption=&page=${pageNo}&evaldiv=a`
    const reviews = await getReviews(reviewURL)

    result.push(...reviews)

    if (reviews.length === 0 || result.length > 200) {
      console.log(`리뷰 개수: ${result.length}`)
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

  if ($('.noData').length !== 0) return []

  const trs = $('tbody tr:not([class])')

  trs.each((i, e) => {
    const first = $(e)
    const second = $(e).next('.talkMore')

    const writer = first.find('td').eq(3).text().trim()
    const date = first.find('td').eq(2).text().trim()

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

const result = await extract(
  'http://www.10x10.co.kr/shopping/category_prd.asp?itemid=5616003&gaparam=bestaward_b_3'
)

console.log(result)
