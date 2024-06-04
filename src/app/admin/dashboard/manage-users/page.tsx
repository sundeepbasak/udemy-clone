'use client'

import { API_URL } from '@/constants/url'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProfileCard from '@/components/Cards/ProfileCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Users() {
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [bannedUsers, setBannedUsers] = useState<any[]>([])

  async function fetchActiveUsers() {
    try {
      const res = await fetch(`${API_URL}/user?isActive=true`)

      return res.json()
    } catch (error) {
      console.log('error fetching users', error)
    }
  }

  async function fetchBannedUsers() {
    try {
      const res = await fetch(`${API_URL}/user?isActive=false`)

      return res.json()
    } catch (error) {
      console.log('error fetching users', error)
    }
  }

  const fetchAll = useCallback(async () => {
    const activeUsersData = fetchActiveUsers()
    const bannedUsersData = fetchBannedUsers()
    Promise.all([activeUsersData, bannedUsersData])
      .then((values) => {
        const [activeUsers, bannedUsers] = values

        setActiveUsers(activeUsers.data)
        setBannedUsers(bannedUsers.data)
      })
      .catch((error) => {
        console.log('Promise.all error', error)
      })
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  console.log({ activeUsers })

  async function handleBan(userId: string) {
    const res = await fetch(
      `${API_URL}/user/${userId}/blacklistt?blacklist=true`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (res.ok) {
      toast.success('Added to blacklist')
      fetchAll()
    } else {
      toast.error('Failed to add!')
    }
  }

  async function handleReactive(userId: string) {
    const res = await fetch(
      `${API_URL}/user/${userId}/blacklistt?blacklist=false`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (res.ok) {
      toast.success('Reactived')
      fetchAll()
    } else {
      toast.error('Failed to reactive!')
    }
  }

  return (
    <>
      <h3>Manage Users</h3>
      <Tabs defaultValue='active'>
        <TabsList>
          <TabsTrigger value='active'>Active Users</TabsTrigger>
          <TabsTrigger value='deactive'>Banned Users</TabsTrigger>
        </TabsList>
        <TabsContent value='active'>
          <div className='grid grid-cols-3 gap-4'>
            {activeUsers.map((user) => {
              const firstLetter = user.fullname.split(' ')[0][0]
              const secondLetter = user.fullname.split(' ')[1][0]

              const placeholder =
                firstLetter + (secondLetter ? secondLetter : '')

              return (
                <ProfileCard
                  key={user.id}
                  user={user}
                  placeholder={placeholder}
                  onBan={handleBan}
                />
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value='deactive'>
          <div className='grid grid-cols-3 gap-4'>
            {bannedUsers.map((user) => {
              const firstLetter = user.fullname.split(' ')[0][0]
              const secondLetter = user.fullname.split(' ')[1][0]

              const placeholder =
                firstLetter + (secondLetter ? secondLetter : '')

              return (
                <ProfileCard
                  key={user.id}
                  user={user}
                  placeholder={placeholder}
                  onReactive={handleReactive}
                />
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
