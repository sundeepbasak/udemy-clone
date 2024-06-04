import { ISubCategory } from '@/interfaces/client.interface'

export interface Course {
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

export interface Topic {
  id: number
  name: string
  cat_id: number
}

export interface EnrolledCourse extends Course {
  last_watched_video: number
  last_watched_video_progress: string
  completed_videos: number
  total_videos: number
  current_section: number
}

export interface Video {
  title: string
  vorder: number
  url: string
  vid: number
  completed: boolean
  sid: number
}

export interface Section {
  title: string
  sorder: number
  videos: Video[]
  sid: string
}

export interface Category {
  id: string
  name: string
}

export interface SubCategory extends Category {
  cat_id: string
}

export interface CategoriesProps {
  categories: Category[] | null
  subCategories: SubCategory[] | null
  onChangeCategory: (categoryId: number | null) => void
}

export type CategoryLookup = { [categoryId: number]: SubCategory[] }

export interface SubCategoriesMapper {
  [catId: string]: { id: string; name: string }[]
}

export interface SelectedSubCategory extends Category {}

export type SearchItem = 'term' | 'subcategory' | 'category'

export interface UserDetails {
  avatar: string
  email: string
  fullname: string
}

export interface UserContextProps {
  user: UserDetails
  isLoadingUser: boolean
  isSubmitting: boolean
  handleSubmit: any
  handleNameChange: any
}

export interface Question {
  created_at: string
  fullname: string
  id: number
  qn_detail: string
  updated_at: string
  user_id: number
}

export interface VideoLecture {
  completed: boolean
  title: string
  url: string
  vid: number
  vorder: number
}

// ------------------------

export type CategoryLookupType = { [categoryId: number]: ISubCategory[] }
export type SearchItemType = 'term' | 'subcategory' | 'category'
