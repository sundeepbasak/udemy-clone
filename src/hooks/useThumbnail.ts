import { API_URL } from '@/constants/url'
import { useEffect, useState } from 'react'

async function getResolvedThumbnail(thumbnail: string) {
  const res = await fetch(`${API_URL}/files/download?key=${thumbnail}`)

  return res.json()
}

export const useThumbnail = (thumbnail: string) => {
  const [resolvedThumbnail, setResolvedThumbnail] = useState('')

  useEffect(() => {
    async function fetchThumbnails() {
      const data = await getResolvedThumbnail(thumbnail)

      setResolvedThumbnail(data.url)
    }

    fetchThumbnails()
  }, [thumbnail])

  return resolvedThumbnail
}
