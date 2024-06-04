export interface ICourse {
  id: number
  title: string
  course_slug: string
  instructor: string
  mrp_price: number
  discount: number
  is_free: boolean
  thumbnail: string
  description: string
  category: string
  sub_category: string
}

export interface ITopic {
  id: number
  name: string
  cat_id: number
}

export interface IEnrolledCourse extends ICourse {
  last_watched_video: number
  last_watched_video_progress: string
  completed_videos: number
  total_videos: number
  current_section: number
}

export interface IVideo {
  title: string
  vorder: number
  url: string
  vid: number
  completed: boolean
  sid: number
}

export interface ISection {
  title: string
  sorder: number
  videos: IVideo[]
  sid: string
}

export interface ICategory {
  id: string
  name: string
}

export interface ISubCategory extends ICategory {
  cat_id: string
}

export interface ICategoriesProps {
  categories: ICategory[] | null
  subCategories: ISubCategory[] | null
  onChangeCategory: (categoryId: number | null) => void
}

export interface ISubCategoriesMapper {
  [catId: string]: { id: string; name: string }[]
}

export interface ISelectedSubCategory extends ICategory {}

export interface IUserDetails {
  avatar: string
  email: string
  fullname: string
}

export interface IUserContextProps {
  user: IUserDetails
  isLoadingUser: boolean
  isSubmitting: boolean
  handleSubmit: any
  handleNameChange: any
}

export interface IQuestion {
  created_at: string
  fullname: string
  id: number
  qn_detail: string
  updated_at: string
  user_id: number
}

export interface IVideoLecture {
  completed: boolean
  title: string
  url: string
  vid: number
  vorder: number
}
