import { JWT_SECRET } from '@/constants/config.constants'
import { userService } from '@/services/user.service'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

//endpoint: /api/user/profile

export interface IUpdateProfile {
  fullname: string
  avatar: string
}

export async function GET(req: NextRequest) {
  try {
    // const demoEmail = 'uddiptagogoi2000@gmail.com' //decoded?.email!
    const decoded = await getToken({ req, secret: JWT_SECRET })
    console.log('profile hit get', decoded)
    if (!decoded?.email) {
      return NextResponse.json({ data: 'User not found' })
    }
    const user = await userService.getProfileDetails(decoded?.email)
    return NextResponse.json({ data: user })
  } catch (error) {
    console.error(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // const demoEmail = 'uddiptagogoi2000@gmail.com' //decoded?.email!
    const decoded = await getToken({ req, secret: JWT_SECRET })
    const requestData: IUpdateProfile = await req.json()
    if (!decoded?.email) {
      return NextResponse.json({ data: 'User not found' })
    }
    const result = await userService.updateProfileDetails(
      decoded.email,
      requestData
    )
    return NextResponse.json({
      data: result,
      message: 'Profile Updated successfully!!',
    })
  } catch (error) {
    console.error(error)
  }
}
