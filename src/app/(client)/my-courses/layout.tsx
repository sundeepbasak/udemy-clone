import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className='pt-10 bg-violet-900 text-white'>
        <div className='container mx-auto w-[90%] lg:w-full h-28'>
          <h2 className='font-semibold text-4xl mb-5 text-center lg:text-left'>
            My Learning
          </h2>
        </div>
      </div>
      <section className='min-h-screen'>
        <div className='container mx-auto'>{children}</div>
      </section>
    </>
  )
}
