'use client'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BanIcon, CheckCircle } from 'lucide-react'

// import { Avatar, Button } from "flowbite-react";
// import { LiaBanSolid } from "react-icons/lia";
// import { TbDiscountCheck } from "react-icons/tb";

export default function ProfileCard({
  user,
  onBan,
  onReactive,
  placeholder,
}: {
  user: any
  onBan?: any
  onReactive?: any
  placeholder: any
}) {
  return (
    <div
      key={user.id}
      className='flex gap-2 mb-4 items-center bg-gray-200 p-3 rounded-md'
    >
      <Avatar className='p-4 border rounded-md' />
      <div className='flex flex-col items-start ml-4'>
        <div className='flex items-center justify-between'>
          <h4 className='font-semibold mr-4'>{user.fullname}</h4>
          <Button
            onClick={onBan ? () => onBan(user.id) : () => onReactive(user.id)}
            className='ml-auto rounded-full'
          >
            {onBan ? <BanIcon /> : <CheckCircle />}
          </Button>
        </div>
        <h5 className='text-sm mb-2'>{user.email}</h5>
        <h6 className='bg-slate-950 text-white px-2 rounded-md py-1 text-sm text-center'>
          {user.enrolled_courses_count} courses enrolled
        </h6>
      </div>
    </div>
  )
}
