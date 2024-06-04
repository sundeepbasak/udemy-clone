import Razorpay from 'razorpay'
import { } from "razorpay"

export const razorpayInstance = new Razorpay({
    key_id: "",
    key_secret: ""
})

enum CURRENCY {
    INR = 'INR',
    USD = 'USD',
    EUR = 'EUR'
}


const demoPayment = async () => {
    const res = await razorpayInstance.orders.create({
        amount: 499,
        currency: CURRENCY.INR,
        receipt: '',
        method: 'upi',
    })
}

/* 

method: 'netbanking' | 'upi' | 'card' | 'emandate' | 'nach';

*/