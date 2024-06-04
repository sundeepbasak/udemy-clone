'use client'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { Component } from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import heroImg from '../../../public/images/f47cd402-a9fb-4411-ac3a-247085be113f.jpg'

function NextArrow(props: { className: any; style: any; onClick: any }) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  )
}

function PrevArrow(props: { className: any; style: any; onClick: any }) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  )
}

const CustomArrow = () => {
  return <div className='text-black'>Hello</div>
}

const imagesArray = [
  {
    id: 1,
    url: '/images/f47cd402-a9fb-4411-ac3a-247085be113f.jpg',
  },
  {
    id: 2,
    url: '/images/d2577afe-04ec-43c2-b07c-68c2ce780e66.jpg',
  },
]

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // nextArrow: <NextArrow />,
      // prevArrow: <PrevArrow />,
    }
    return (
      <div>
        <Slider {...settings}>
          {imagesArray.map((item: { id: number; url: string }) => (
            <div className='relative h-100' key={item.id}>
              <Image
                src={item.url}
                alt='image'
                width={0}
                height={0}
                sizes='80vw'
                className='object-cover'
                style={{ width: '100%', height: 'auto', maxHeight: '50vh' }}
              />
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}
