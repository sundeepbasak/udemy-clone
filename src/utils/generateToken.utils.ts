import crypto from 'crypto';
import jwt from 'jsonwebtoken'

export function generateToken(payload: any, expiresIn: string) {
    // return crypto.randomBytes(16).toString('hex');
    return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
        expiresIn
    })
}