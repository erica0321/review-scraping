import axios from 'axios'
import { load } from 'cheerio'
import { extract_tenxtex } from './tenxten.js'
import { extract_ably } from './ably.js'

const tenxten = await extract_tenxtex(
  'http://www.10x10.co.kr/shopping/category_prd.asp?itemid=5616003&gaparam=bestaward_b_3'
)

const ably = await extract_ably('https://m.a-bly.com/goods/2982671')

console.log(tenxten)
console.log(ably)
