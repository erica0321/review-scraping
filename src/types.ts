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

export type { Review, Result }
