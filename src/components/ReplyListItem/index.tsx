import moment from 'moment'
import { Avatar } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
// import { BsThreeDotsVertical } from 'react-icons/bs'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { FolderDotIcon } from 'lucide-react'

const ReplyListItem = ({
  reply,
  onReplyEdit,
}: {
  reply: any
  onReplyEdit: any
}) => {
  const [isReplyToQuestion, setIsReplyToQuestion] = useState(false)
  const [updatedReplyText, setUpdatedReplyText] = useState(reply.reply_text)
  const [isSubmittingReplyEdit, setIsSubmittingReplyEdit] = useState(false)

  const rtime = moment(reply.updated_at, 'YYYYMMDD').fromNow()

  // const handleReplyEdit = async (e:any) => {
  //   e.preventDefault()

  // }

  const handleReplyDelete = () => {}

  return (
    <li className='flex gap-3 my-2 items-start'>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-1'>
        {isReplyToQuestion ? (
          <div>
            <div className='font-semibold'>{reply.fullname}</div>
            <span className='text-xs font-light'>{rtime}</span>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmittingReplyEdit(true)
                await onReplyEdit(reply.id, updatedReplyText)
                setIsReplyToQuestion(false)
                setIsSubmittingReplyEdit(false)
              }}
            >
              <Input
                type='text'
                value={updatedReplyText}
                onChange={(e) => setUpdatedReplyText(e.target.value)}
              />
              <div className='flex gap-2 mt-3'>
                <Button
                  onClick={() => setIsReplyToQuestion(false)}
                  variant='secondary'
                  className='ml-auto'
                >
                  Cancel
                </Button>
                <Button disabled={isSubmittingReplyEdit}>
                  {isSubmittingReplyEdit ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div>
              <div className='font-semibold'>{reply.fullname}</div>
              <div className='flex gap-5 items-center'>
                <div>{reply.reply_text}</div>
                <span className='text-xs font-light'>{rtime}</span>
              </div>
            </div>
            <div className='ml-auto'>
              <DropdownMenu>
                <DropdownMenuTrigger className='flex'>
                  <FolderDotIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsReplyToQuestion(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleReplyDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

export default ReplyListItem
