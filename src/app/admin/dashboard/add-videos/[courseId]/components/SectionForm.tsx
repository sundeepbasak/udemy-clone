'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SectionForm({
  onClose,
  onAddSection,
}: {
  onClose: any
  onAddSection: any
}) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()

    console.log('hello')
    setLoading(true)
    console.log({ title, description })
    await onAddSection(title, description)
    onClose()
    setLoading(false)
  }

  return (
    <div>
      <button onClick={onClose}>X</button>
      <form className='border border-black min-h-[100px] p-3'>
        <div className='mb-3'>
          <label>
            New Section:
            <Input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div className='mb-3'>
          <label>
            Description:
            <Input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        {loading ? (
          <Button>
            <Loader2 className='animate-spin' />
            <span className='pl-3'>wait...</span>
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Add section</Button>
        )}
      </form>
    </div>
  )
}
