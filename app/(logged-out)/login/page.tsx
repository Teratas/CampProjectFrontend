'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from 'zod'
import { loginFunction } from "./action";
import Link from "next/link";

const formSchema = z.object({
  email : z.string().email(),
  password: z.string().min(6)
})

type FormFields = z.infer<typeof formSchema>

export default function LoginPage() {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email : "",
      password: ""
    }

  })
  const handleSubmit = async (data : FormFields) => {
    console.log(data)
    await loginFunction(data)
  }
  return (
    <main className='min-h-screen flex justify-center items-center'>
      <Card className='w-[500px] h-[600px]'>
        <CardHeader>
          <CardTitle className='text-3xl flex justify-center'>Login</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-0'>
          <Form {...form}>
            <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField control={form.control} name="email" render={({field}) => (
                <FormItem>
                  <FormLabel className='text-xl'>Email</FormLabel>
                  <FormControl>
                    <Input {...field} className='h-[50px]' type='text'/>
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="password"  render={({field}) => (
                <FormItem>
                  <FormLabel className='text-xl'>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' className='h-[50px]'/>
                  </FormControl>
                </FormItem>
              )} />
              <Button type='submit'>
                Login
              </Button>
            </form>  
          </Form>
          
          <div className='w-full flex flex-col gap-2'>
            <Separator className='mb-2'/>
            <Button onClick={() => signIn('facebook')} className='h-[60px] bg-blue-600 text-2xl'>Login with Facebook</Button>
            <Button onClick={() => signIn("github")} className='h-[60px] bg-slate-800 text-white text-2xl'>Login with Github</Button>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <span className='text-muted-foreground'>Don't Have An Accounts <Link href="/register" className='underline'>Sign Up</Link></span>
        </CardFooter>
      </Card>

    </main>
  );
}