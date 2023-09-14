import { extract as ex_ten } from './tenxten.js'
import { extract as ex_ably } from './ably.js'
import { extract as ex_blog } from './blogpay.js'

// const tenxten = await ex_ten(
//   'http://www.10x10.co.kr/shopping/category_prd.asp?itemid=5616003&gaparam=bestaward_b_3'
// )

// const ably = await ex_ably('https://m.a-bly.com/goods/2982671')

const blogpay = await ex_blog(
  'https://juuvuv.shop.blogpay.co.kr/good/product_view?goodNum=203092667'
)

// console.log(tenxten)
// console.log(ably)
console.log(blogpay)
