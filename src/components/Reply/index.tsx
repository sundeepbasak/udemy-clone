import { useCallback, useEffect, useState } from 'react'
import ReplyList from '../ReplyList'
import { API_URL } from '@/constants/url'
import ReplyForm from '../ReplyForm'
import { toast } from 'react-toastify'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
// import { BsThreeDotsVertical } from 'react-icons/bs'
import { LucideDot } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'

export default function Reply({
  courseId,
  discussionId,
}: {
  courseId: string
  discussionId: string | null
}) {
  const [discussion, setDiscusion] = useState<any>(null)
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(false)
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [replies, setReplies] = useState<any>(null)
  const [isSubmittingQuestionEdit, setIsSubmittingQuestionEdit] =
    useState(false)

  const [updateFormInfo, setUpdateFormInfo] = useState({
    title: discussion?.qn_title,
    details: discussion?.qn_detail,
  })

  const fetchQuestion = async () => {
    setIsLoadingDiscussion(true)
    const res = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}`
    )
    if (res.ok) {
      const data = await res.json()
      setDiscusion(data.data)
      setUpdateFormInfo({
        title: data.data.qn_title,
        details: data.data.qn_detail,
      })
      setIsLoadingDiscussion(false)
    } else {
      setIsLoadingDiscussion(false)
      console.error('Error fetching question')
    }
  }

  const fetchQuestionAndReplies = useCallback(async () => {
    const res = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}`
    )

    if (res.ok) {
      const data = await res.json()
      setDiscusion(data.data)
      setUpdateFormInfo({
        title: data.data.qn_title,
        details: data.data.qn_detail,
      })
      setReplies(data.data.replies)
    } else {
      console.error('Discucssion error')
    }
  }, [courseId, discussionId])

  useEffect(() => {
    fetchQuestionAndReplies()
  }, [fetchQuestionAndReplies])

  const fetchReplies = useCallback(async () => {
    const res = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}`
    )

    if (res.ok) {
      const data = await res.json()
      setReplies(data.data.replies)
    } else {
      console.error('Discucssion error')
    }
  }, [courseId, discussionId])

  async function handleAddAnswer(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const reply_text = formData.get('reply')

    const response = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}/replies`,
      {
        method: 'POST',
        body: JSON.stringify({ reply_text }),
      }
    )

    if (response.ok) {
      toast.success('Answer Added')

      e.target.reset()
      fetchReplies()
    } else {
      toast.error('Failed! Try again')
    }
  }

  async function handleQuestionDelete() {}

  const handleQuestionEdit = async (e: any) => {
    e.preventDefault()
    setIsSubmittingQuestionEdit(true)

    const res = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          qn_title: updateFormInfo.title,
          qn_detail: updateFormInfo.details,
        }),
      }
    )

    if (res.ok) {
      toast.success('Question Updated')
      fetchQuestion()
      setIsEditingQuestion(false)
      setIsSubmittingQuestionEdit(false)
    } else {
      setIsSubmittingQuestionEdit(false)
      console.error('Failed to update the question')
    }
  }

  const handleReplyEdit = async (rid: string, reply_text: string) => {
    const res = await fetch(
      `${API_URL}/course/${courseId}/discussion/${discussionId}/replies/${rid}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          reply_text,
        }),
      }
    )

    if (res.ok) {
      toast.success('Question Updated')
      fetchReplies()
      setIsEditingQuestion(false)
    } else {
      console.error('Failed to update the question')
    }
  }

  return (
    <div className='w-4/5 my-8'>
      <div className='flex items-start my-3'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          {isEditingQuestion ? (
            <div>
              <form className='w-4/5' onSubmit={handleQuestionEdit}>
                <div className='w-full mb-3'>
                  <label>
                    <div className='font-md'>Title or Summary</div>
                    <Input
                      type='text'
                      placeholder='e.g.Why flex but not grid?'
                      name='qn_title'
                      value={updateFormInfo.title}
                      onChange={(e) =>
                        setUpdateFormInfo({
                          ...updateFormInfo,
                          title: e.target.value,
                        })
                      }
                      required
                      className='w-full'
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <div className='font-md'>Details (optional)</div>
                    <Textarea
                      name='qn_detail'
                      placeholder="e.g. At 05.28, I didn't understand the part"
                      className='w-full resize-none'
                      value={updateFormInfo.details}
                      onChange={(e) =>
                        setUpdateFormInfo({
                          ...updateFormInfo,
                          details: e.target.value,
                        })
                      }
                    ></Textarea>
                  </label>
                </div>
                <div className='mt-5 flex gap-3'>
                  <Button
                    variant='secondary'
                    className='text-center'
                    onClick={() => setIsEditingQuestion(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmittingQuestionEdit}
                    className='text-center'
                  >
                    {isSubmittingQuestionEdit
                      ? 'Updating...'
                      : 'Update Question'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className='flex justify-between'>
              {isLoadingDiscussion ? (
                <>
                  <div>Loading...</div>
                </>
              ) : (
                <>
                  <div className='pl-3'>
                    <h5>{discussion?.qn_title}</h5>
                    <p>{discussion?.qn_detail}</p>
                  </div>
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger className='flex'>
                        <LucideDot />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setIsEditingQuestion(true)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleQuestionDelete}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ReplyList replies={replies} onReplyEdit={handleReplyEdit} />
      <ReplyForm onAddAnswer={handleAddAnswer} />
    </div>
  )
}
