import { API_URL } from '@/constants/url'
import { useCallback, useEffect, useState } from 'react'
import QuestionAnswerList from '../QuestionAnswerList'
import { Input } from '../ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '../ui/button'
import { useCourseData } from '@/hooks/useCourseData'
import { useSectionsData } from '@/hooks/useSectionsData'
import Reply from '../Reply'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export default function Discussion({
  courseId,
  questionAnswers,
  onQuestionPublish,
}: {
  courseId: string
  questionAnswers: any
  onQuestionPublish: any
}) {
  const [isReply, setIsReply] = useState(false)
  const [discussionId, setDiscusionId] = useState<null | string>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormShown, setIsFormShown] = useState(false)

  function toggleForm() {
    setIsFormShown(!isFormShown)
  }

  // const { isLoading: isLoadingCourse, data: course } = useCourseData(
  //   courseId,
  //   'cid'
  // )
  // const { isLoading: isLoadingSections, data: sections } = useSectionsData(
  //   +courseId,
  //   true
  // )

  function handleReply() {
    setIsReply(!isReply)
  }

  function handleDiscussionReply(discussionId: string) {
    handleReply()

    setDiscusionId(discussionId)

    console.log('hello')
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setIsSubmitting(true)
    await onQuestionPublish(e)
    setIsSubmitting(false)
  }

  return (
    <>
      {!isReply ? (
        <div>
          <div className='py-6'>
            {isFormShown && (
              <form className='w-full lg:w-4/5' onSubmit={handleSubmit}>
                <div className='w-full mb-3'>
                  <label>
                    <div className='font-md'>Title or Summary</div>
                    <Input
                      type='text'
                      placeholder='e.g.Why flex but not grid?'
                      name='qn_title'
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
                    ></Textarea>
                  </label>
                </div>
                <div className='mt-5'>
                  <Button
                    variant='secondary'
                    className='mr-3'
                    onClick={toggleForm}
                  >
                    Cancel
                  </Button>
                  <Button className='text-center' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 animate-spin' /> Adding...
                      </>
                    ) : (
                      'Add Question'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
          <div>
            <div>
              <QuestionAnswerList
                questionAnswers={questionAnswers}
                courseId={courseId}
                onDiscussionReply={handleDiscussionReply}
                toggleForm={toggleForm}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Button
            onClick={handleReply}
            className='rounded-none'
            variant='outline'
          >
            Back to all Questions
          </Button>
          <Reply courseId={courseId} discussionId={discussionId} />
        </div>
      )}
    </>
  )
}
