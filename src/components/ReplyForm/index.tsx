import { API_URL } from '@/constants/url'
import { Button } from '@/components/ui/button'
import { Textarea } from '../ui/textarea'

export default function ReplyForm({ onAddAnswer }: { onAddAnswer: any }) {
  return (
    <form className='w-full mt-8' onSubmit={onAddAnswer}>
      <label>
        <div className='text-sm font-semibold mb-2'>Write your Response</div>
        <Textarea
          name='reply'
          placeholder='write your response'
          className='resize-none w-full mb-3'
        ></Textarea>
      </label>
      <Button>Add an answer</Button>
    </form>
  )
}
