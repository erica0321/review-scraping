import { reviewScraperFactory } from './src/reviewScraperFactory.js'

//tenxten 주소
// 'http://www.10x10.co.kr/shopping/category_prd.asp?itemid=5616003&gaparam=bestaward_b_3'

//ably 주소
// 'https://m.a-bly.com/goods/2982671'

//blogpay 주소
// 'https://juuvuv.shop.blogpay.co.kr/good/product_view?goodNum=203092667'

//brandi 주소
// 'https://www.brandi.co.kr/products/106362123?tab=2'

let reviewScraper = await reviewScraperFactory(
  'https://www.brandi.co.kr/products/106362123?tab=2'
)
console.log(await reviewScraper.scrap())
