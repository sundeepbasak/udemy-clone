'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

import styled from 'styled-components'

const SliderWrapper = styled.div`
  /* Hide the slick arrows */
  .slick-prev,
  .slick-next {
    display: none !important;
  }
`

const images = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1521649415036-659258dc424f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

const AutoplaySlider = () => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    // prevArrow: () => null,
    // nextArrow: () => null,
  }

  return (
    <SliderWrapper className='relative h-screen overflow-hidden'>
      <Slider {...settings} className='relative'>
        {images.map((image) => (
          <div key={image.id} className='h-screen'>
            {/* Assuming you have a CSS class to style your images */}
            <Image
              className='w-full h-full object-cover'
              width={1000}
              height={1000}
              alt='image'
              src={image.url}
            />
          </div>
        ))}
      </Slider>
    </SliderWrapper>
  )
}

export default AutoplaySlider
