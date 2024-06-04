import { API_URL } from '@/constants/url'
import { useEffect, useState } from 'react'

const usePresignedUrl = (fileKey: string | null) => {
  const [presignedUrl, setPresignedUrl] = useState(null)

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await fetch(`${API_URL}/files/download?key=${fileKey}`)
        const { url } = await response.json()
        setPresignedUrl(url)
      } catch (error) {
        console.error('Error fetching presigned URL:', error)
      }
    }

    fetchPresignedUrl()
  }, [fileKey])

  return presignedUrl
}

export default usePresignedUrl
