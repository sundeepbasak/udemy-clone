'use client'
import { useSearchResults } from '@/hooks/useSearchResults'
import Card from '../Cards/Card'
import Spinner from '../Spinner'
import CourseSlider from '../CourseSlider'

export default function CoursesByCategory({ category }: { category: string }) {
  const { data: courses, isLoading } = useSearchResults(category, 'category')

  if (courses?.length === 0) return null

  return (
    <section className='py-5'>
      <h2 className='font-semibold text-2xl mb-5'>{category}</h2>
      <div>
        <CourseSlider>
          {isLoading && (
            <div>
              <Spinner />
            </div>
          )}
          {courses?.map(
            ({
              id,
              title,
              course_slug,
              instructor,
              mrp_price,
              discount,
              is_free,
              thumbnail,
              description,
              sub_category,
              category,
            }: any) => (
              <Card
                key={id}
                id={id}
                title={title}
                course_slug={course_slug}
                instructor={instructor}
                mrp_price={mrp_price}
                discount={discount}
                is_free={is_free}
                thumbnail={thumbnail}
                description={description}
                sub_category={sub_category}
                category={category}
              />
            )
          )}
        </CourseSlider>
      </div>
    </section>
  )
}
