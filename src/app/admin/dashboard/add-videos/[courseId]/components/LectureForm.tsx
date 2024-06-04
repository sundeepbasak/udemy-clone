'use client'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { API_URL } from '@/constants/url'
import { useEffect, useState } from 'react'
import axios, { AxiosProgressEvent, CancelToken, isCancel } from 'axios'
import { Progress } from '@/components/ui/progress'
import { Check, CheckCheck, CheckCircle2, CheckSquare } from 'lucide-react'

const formStyle = {
  border: '1px solid black',
  minHeight: '100px',
  padding: '1rem',
}

export default function LectureForm({
  courseId,
  onEdit,
  onAddLecture,
}: {
  courseId: string
  onEdit: any
  onAddLecture: any
}) {
  const [key, setKey] = useState<string>('')
  const [selectedVideo, setSeletedVideo] = useState<any>(null)
  const [lectureDetails, setLectureDetails] = useState({
    title: '',
    link: '',
    previewable: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target

    const newValue = type === 'checkbox' ? checked : value

    setLectureDetails((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  async function handleSubmit(e: any) {
    e.preventDefault()

    setIsLoading(true)
    const { title, previewable } = lectureDetails
    await onAddLecture(title, key, previewable)
    setLectureDetails({ title: '', link: '', previewable: false })
    onEdit(false)
    setIsLoading(false)
  }
  // const cancelSource = axios.CancelToken.source()
  // const controller = new AbortController()

  async function uploadVideoToS3(
    data: { url: string; key: string },
    file: Blob
  ) {
    try {
      const config = {
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percentCompleted)
        },
        // cancelToken: cancelSource.token,
        // signal: controller.signal,
      }

      const response = await axios.put(data.url, selectedVideo, config)
      console.log('Upload Complete')
      return true
    } catch (error) {
      console.error('Error uploading video:', error)
    }

    // try {
    //   const res = await fetch(data.url, {
    //     method: 'PUT',
    //     body: file,
    //     headers: {
    //       'Content-Type': file.type,
    //       // Add any additional headers you might need (e.g., x-ms-blob-type, x-ms-version)
    //     },
    //   })

    //   if (!res.ok) {
    //     throw new Error('Video upload failed')
    //   }

    //   return true // Indicate successful upload
    // } catch (error) {
    //   console.error('Error uploading video:', error)
    //   throw error
    // }
  }

  const getPresignedUrl = async (courseId: string) => {
    const res = await fetch(`${API_URL}/files/upload?folder=course-${courseId}`)
    return res.json()
  }

  const handleInputChange = (e: any) => {
    setSeletedVideo(e.target.files[0])
  }

  const handleVideoUpload = async (e: any) => {
    setIsUploading(true)
    try {
      console.log(selectedVideo, 'abksc')

      const data = await getPresignedUrl(courseId)
      console.log('Received pre-signed URL:', data.url)
      console.log('key', data.key)
      setKey(data.key)

      const fileData = new Blob([selectedVideo], { type: selectedVideo.type })
      console.log('Uploading video...')

      const uploadResult = await uploadVideoToS3(data, fileData)
      if (uploadResult) {
        console.log('Image uploaded successfully.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Upload process encountered an error:', error)
      setIsLoading(false)
    }
  }

  const handleCancelUpload = () => {
    // setUploadProgress(0)
    // cancelSource.cancel()
  }

  return (
    <div>
      <button onClick={() => onEdit(false)}>X</button>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div className='mb-3'>
          <label>
            New Lecture:
            <Input
              type='text'
              placeholder='Enter a title'
              name='title'
              value={lectureDetails.title}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className='mb-3'>
          <label>
            Upload:
            <Input type='file' name='link' onChange={handleInputChange} />
          </label>
          {uploadProgress === 100 && (
            <div className='flex gap-3'>
              Upload completed <CheckCircle2 />
            </div>
          )}
          {isUploading && (
            <div className='flex mt-3'>
              <Progress value={uploadProgress} />
              <span className='text-sm'>{uploadProgress}%</span>
            </div>
          )}
          <Button
            type='button'
            onClick={handleVideoUpload}
            disabled={isUploading || !selectedVideo}
            className={`w-full ${isUploading && 'flex'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Lecture'}
          </Button>
        </div>
        <div className='mb-3'>
          <label>
            is previewable?:
            <input
              type='checkbox'
              name='previewable'
              checked={lectureDetails.previewable}
              onChange={handleChange}
            />
          </label>
        </div>
        {isLoading ? (
          <Button color='dark' className='rounded-none' type='button'>
            <Spinner />
            <span className='pl-3'>wait...</span>
          </Button>
        ) : (
          <Button type='submit'>Add Lecture</Button>
        )}
      </form>
    </div>
  )
}
