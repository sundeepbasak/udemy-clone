'use client'
import { useCallback, useEffect, useState } from 'react'
import LectureForm from './LectureForm'
import { API_URL } from '@/constants/url'
import SectionEditForm from './SectionEditForm'

const SectionStyle = {
  border: '1px solid black',
  minHeight: '100px',
  minWidth: '300px',
  padding: '1rem',
  margin: '10px 0',
}

export default function Section({
  title,
  sectionId,
  index,
  courseId,
  lectures,
  onFetchSections,
  editExisting,
  onEditExisting,
}: {
  title: any
  sectionId: any
  index: any
  courseId: any
  lectures: any
  onFetchSections: any
  editExisting: any
  onEditExisting: any
}) {
  const [isEditingLecture, setIsEditingLecture] = useState(false)

  function handleClick(e: any) {
    setIsEditingLecture(true)
  }

  async function handleAddLecture(
    title: string,
    url: string,
    previewable: boolean = false
  ) {
    console.log({ title, url, previewable })

    try {
      await fetch(`${API_URL}/course/${courseId}/section/${sectionId}/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url, previewable }),
      })

      onFetchSections()
    } catch (error) {
      console.log('Error fetching Lecture Details')
    }
  }

  return (
    <div style={SectionStyle}>
      {editExisting ? (
        <SectionEditForm onEdit={onEditExisting} />
      ) : (
        <div className='flex gap-3'>
          <h2>{`Section ${index + 1}: ${title}`}</h2>
          <button onClick={onEditExisting}>Edit</button>
        </div>
      )}
      {lectures && (
        <ul className='pl-3'>
          {lectures.map((lecture: any, index: any) => {
            return (
              <li key={lecture.title}>{`Lecture ${index + 1}: ${
                lecture.title
              }`}</li>
            )
          })}
        </ul>
      )}
      {isEditingLecture ? (
        <LectureForm
          courseId={courseId}
          onEdit={setIsEditingLecture}
          onAddLecture={handleAddLecture}
        />
      ) : (
        <button onClick={handleClick} className='border border-black px-3'>
          + lecture
        </button>
      )}
    </div>
  )
}
