'use client'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dot } from 'lucide-react'

import moment from 'moment'
import ReplyListItem from '../ReplyListItem'
import { useState } from 'react'

export default function ReplyList({
  replies,
  onReplyEdit,
}: {
  replies: any[]
  onReplyEdit: any
}) {
  return (
    <>
      <div className='mt-10'>Replies ({replies?.length})</div>
      <ul>
        {replies?.map((reply) => {
          const rtime = moment(reply.updated_at, 'YYYYMMDD').fromNow()

          return (
            <ReplyListItem
              key={reply.id}
              reply={reply}
              onReplyEdit={onReplyEdit}
            />
          )
        })}
      </ul>
    </>
  )
}
