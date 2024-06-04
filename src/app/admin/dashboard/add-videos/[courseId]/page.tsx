import VideoUpload from '@/components/VideoUpload'
import Curriculum from './components/Curriculum'

export default function CurriculumPage() {
  return (
    <main className='pt-5'>
      <div className='container mx-auto min-h-screen'>
        <h2 className='text-xl mb-5'>Course Curriculum</h2>
        <Curriculum />
      </div>
    </main>
  )
}
