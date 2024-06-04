'use client'
import Card from '@/components/Cards/CardCart'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MainFooter from '@/components/Footer'
import { Button } from '@/components/ui/button'

export default function Cart() {
  return (
    <>
      <div className='flex min-h-screen flex-col items-center justify-between py-2'>
        <div className='container max-w-7xl w-[90%] lg:w-full mx-auto lg:pt-10'>
          <h2 className='text-4xl font-semibold my-2 hidden lg:block'>
            Shopping Cart
          </h2>
          <div className='flex flex-col lg:flex-row gap-8 mt-4 items-start'>
            <div className='flex-1 order-2 lg:order-1'>
              <h3>{`${3} Courses in Cart`}</h3>
              <ul className='flex flex-col gap-4 mt-5'>
                <li>
                  <Card />
                </li>
                <li>
                  <Card />
                </li>
                <li>
                  <Card />
                </li>
                <li>
                  <Card />
                </li>
                <li>
                  <Card />
                </li>
              </ul>
            </div>
            <div className='w-full lg:w-1/4 px-5 py-5 bg-gray-100 rounded-md shadow-sm lg:sticky top-12 order-1'>
              <div className='mb-2'>
                <div>Total:</div>
                <div className='text-3xl font-semibold'>&#8377;499</div>
                <div className='line-through'>&#8377;3399</div>
                <div>50% off</div>
              </div>
              <Button className='w-full rounded-md'>Checkout</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
