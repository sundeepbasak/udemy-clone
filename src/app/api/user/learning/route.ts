import { userService } from '@/services/user.service'
import { JWT_SECRET } from '@/constants/config.constants'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '@/utils/responseHandler.utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/authOptions.utils'

//endpoint: /api/user/learning
const httpResponse = new HttpResponse()

export const dynamic = 'force-dynamic'
// export const dynamicParams = true
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url)
    const pageNumber = parseInt(searchParams.get('page') ?? '1')

    const decoded = await getToken({ req, secret: JWT_SECRET })
    console.log('learning hit', decoded, JWT_SECRET)
    if (!decoded?.email) {
      return httpResponse.unauthorize()
    }
    const userId = await userService.getIdByEmail(decoded?.email) //!later use: decoded.email
    if (!userId) {
      throw new Error('User not found!!')
    }

    const myLearning = await userService.getMyLearning(userId, pageNumber)
    if (!myLearning) {
      return NextResponse.json({ data: [] })
    }
    return NextResponse.json({ data: myLearning })
  } catch (error: any) {
    throw new Error(error.message)
  }
}
