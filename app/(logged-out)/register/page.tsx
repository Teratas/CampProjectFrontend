'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import { handleSubmit } from "./action"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const formSchema = z.object({
    email : z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    tel : z.string().min(10).max(10),
    role : z.string().default('user'),
    name : z.string().min(3)

}).superRefine((val, ctx) => {
    if(val.password != val.confirmPassword){
        ctx.addIssue({
            code : z.ZodIssueCode.custom,
            path: ["confirmPassword"],
            message: "Password do not match"
        })
    }
})

type formField = z.infer<typeof formSchema>

export default function Register(){
    const form = useForm<formField>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            email : "",
            password : "",
            confirmPassword : "",
            tel : "",
            name : ""
        }
    })
    const handleSubmitReset = async (data : formField) => {
        const res = await handleSubmit(data)
        console.log('res', res)
        if(res.success){
            form.reset()
            alert('Success')
        }else{
            alert('Failed')
        }
        
    }
    return (
        <main className='min-h-screen flex justify-center items-center'>
            <Card className='w-[500px] h-full flex flex-col gap-6'>
                <CardHeader>
                    <CardTitle className='text-2xl flex justify-center'>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmitReset)}>
                            <div className='flex flex-col gap-5'>
                                <FormField control={form.control} name='email' render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name='name' render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                
                                        <FormControl>
                                            <Input type='text' {...field}/>
                                
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name='tel' render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Tel</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name='password' render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name='confirmPassword' render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                
                                        <FormControl>
                                            <Input type='password' {...field}/>
                                
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                            <FormItem className='mt-6'>
                                <Button type='submit'>Register</Button>
                            </FormItem>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className='flex justify-center'>
          <span className='text-muted-foreground'>Don't Have An Accounts <Link href="/login" className='underline'>Login</Link></span>
        </CardFooter>
            </Card>
        </main>
    )
}