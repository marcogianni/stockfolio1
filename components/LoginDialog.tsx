/* eslint-disable react/no-unescaped-entities */
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { useToast } from '@/components/ui/use-toast'

import type { Database } from '@/lib/database.types'

const loginFormSchema = z.object({
  email: z.string().email({
    message: 'Must be a valid email',
  }),
  password: z.string().min(12).max(50),
})

const registerFormSchema = z
  .object({
    email: z.string().email({
      message: 'Must be a valid email',
    }),
    password: z
      .string()
      .min(12, { message: 'Password must be at least 12 characters' })
      .max(50, { message: 'Password must be a maximum of 50 characters long' }),
    repeatPassword: z
      .string()
      .min(12, { message: 'Password must be atleast 12 characters' })
      .max(50, { message: 'Password must be a maximum of 50 characters long' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: "Password don't match",
  })

export default function LoginDialog() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('login') // login | register

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setMode('login')
    }, 200)
  }

  return (
    <Dialog open={open}>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      <DialogContent className="sm:max-w-[600px]">
        <div className="flex items-center justify-end h-8">
          <Button variant="outline" size="icon" onClick={handleClose} className="absolute">
            <Cross1Icon />
          </Button>
        </div>
        {mode === 'login' ? (
          <FormLogin switchMode={() => setMode('register')} handleClose={handleClose} />
        ) : (
          <FormRegister switchMode={() => setMode('login')} handleClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

const FormLogin = ({ switchMode, handleClose }: { switchMode: () => void; handleClose: () => void }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: { email: string; password: string }) {
    setLoading(true)
    handleSignIn(values)
  }

  const handleSignIn = async (values: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast({
        title: 'Error',
        description: error?.message,
      })
    }

    console.debug('handleSignIn', { data, error })
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sign in</DialogTitle>
        <DialogDescription className="mt-16">Insert your email and password used in registration and click the button.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" id="email" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" id="password" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <div className="w-full">
              <Button size="lg" type="submit" className="w-full">
                Sign in
              </Button>
              <Separator className="mt-3" />
              <Button size="lg" className="w-full mt-3" variant="secondary" onClick={switchMode}>
                Register
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

const FormRegister = ({ switchMode, handleClose }: { switchMode: () => void; handleClose: () => void }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  })

  function onSubmit(values: { email: string; password: string }) {
    setLoading(true)
    handleSignUp(values)
  }

  const handleSignUp = async (values: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    console.debug('handleSignUp', { data, error })
    if (error) {
      toast({
        title: 'Error',
        description: error?.message,
      })
    }

    console.debug('handleSignIn', error?.message)
    router.refresh()
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Register</DialogTitle>
        <DialogDescription className="mt-16">
          Only an email is required, we ask for no further information, and it is free of charge.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" id="email" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" id="password" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Repeat Password" id="repeatPassword" className="col-span-3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <div className="w-full">
              <Button type="submit" size="lg" className="w-full">
                Register
              </Button>

              <Separator className="mt-3" />

              <Button variant="secondary" size="lg" className="w-full mt-3" onClick={switchMode}>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="pl-2">Back to Sign in</span>
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
