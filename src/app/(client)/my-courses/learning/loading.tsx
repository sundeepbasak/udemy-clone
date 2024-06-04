// by default client component

import Spinner from '@/components/Spinner'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className='flex justify-center h-96 items-center'>
      <Spinner />
    </div>
  )
}

export default Loading
