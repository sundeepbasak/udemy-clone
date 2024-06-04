'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useParams } from 'next/navigation'
import Discussion from '../Discussion'

const CourseInfoTab = ({
  questionAnswers,
  description,
  onQuestionPublish,
}: {
  description: string | undefined
  questionAnswers: any
  onQuestionPublish: any
}) => {
  const { id } = useParams()

  return (
    <>
      <Tabs className='w-full pb-28' defaultValue='overview'>
        <TabsList className='w-full rounded-none justify-start shadow-sm'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='discussion'>Discussion</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>{description}</TabsContent>
        <TabsContent value='discussion'>
          <Discussion
            courseId={id}
            questionAnswers={questionAnswers}
            onQuestionPublish={onQuestionPublish}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default CourseInfoTab
