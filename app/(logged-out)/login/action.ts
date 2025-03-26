'use server'

import { signIn } from "@/auth"



export const loginFunction = async (data : {email : string, password : string}) => {
    console.log('dataLogin', data)
    await signIn('credentials', {
        ...data,
        redirect: true
    })
}