// const Categories = ({
//   categories,
//   subCategories,
//   onChangeCategory,
// }: CategoriesProps): JSX.Element => {
//   return (
// <div className="absolute top-5 left-0 bg-slate-300 p-5 min-w-full z-1 shadow-md flex gap-6">
//   <div>
//     {categories &&
//       categories.map((category) => {
//         return (
//           <div
//             key={category.id}
//             id={category.id}
//             onMouseEnter={(e) =>
//               onChangeCategory(
//                 parseInt((e.target as HTMLDivElement).id, 10)
//               )
//             }
//           >
//             {category.name}
//           </div>
//         );
//       })}
//   </div>
//   <div>
//     {subCategories &&
//       subCategories.map((s) => {
//         return <div key={s.id}>{s.name}</div>;
//       })}
//   </div>
// </div>
//   );
// };

import { useState } from 'react'
import { Separator } from '../ui/separator'
import {
  ArrowRight,
  ArrowRightToLine,
  ChevronRight,
  LucideArrowRightCircle,
} from 'lucide-react'
import Link from 'next/link'

const Categories = ({
  categories,
  subCategoriesLookup,
}: {
  categories: any
  subCategoriesLookup: any
}) => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<any>(null)
  // const [clicked, setClicked] =

  const subCategories = subCategoriesLookup[hoveredCategoryId]

  console.log({ hoveredCategoryId })

  const handleMouseEnter = (e: any) => {
    setHoveredCategoryId(e.target.dataset.id)
  }

  const handleClick = (searchItem: string, type: string) => {}

  return (
    <div className='absolute top-5 left-0 min-w-full z-1 shadow-md flex'>
      <div className='w-[300px] px-2 shadow-lg bg-white'>
        {categories &&
          categories.map((category: any) => {
            return (
              <Link
                key={category.id}
                href={`/search?category=${category.name}`}
              >
                <div
                  className='my-2 p-2 text-md hover:bg-gray-100 rounded-md font-semibold flex justify-between'
                  id={category.id}
                  data-id={category.id}
                  onMouseEnter={handleMouseEnter}
                  // onClick={() => handleClick(category.name, 'category')}
                >
                  {category.name}
                  <ChevronRight />
                </div>
              </Link>
            )
          })}
      </div>
      {hoveredCategoryId && (
        <div className='w-[300px] px-2 shadow-lg bg-white'>
          {subCategories &&
            subCategories.map((s: any) => {
              return (
                <Link href={`/search?sub_category=${s.name}`} key={s.id}>
                  <div
                    key={s.id}
                    className='my-2 p-2 text-md hover:bg-gray-100 rounded-md font-semibold'
                    onClick={() => handleClick(s.name, 'subcategory')}
                  >
                    {s.name}
                  </div>
                </Link>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default Categories
