'use client'

import { Icons } from '@/components/Icons'
import InputContainer from '@/components/InputContainer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import signInSchema from '@/schemas/form/signin-form.schema'
import { Button } from '@/components/ui/button'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AutoplaySlider from '@/components/AutoplaySlider'

const initialValues = {
  email: '',
  password: '',
}

const LoginPage = () => {
  const router = useRouter()

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useFormik({
      initialValues,
      validationSchema: signInSchema,
      onSubmit: (values) => {
        // signIn('credentials', {
        //   email: values.email,
        //   password: values.password,
        //   redirect: false,
        // })
        router.push('/admin/dashboard')
      },
    })

  console.log(values)

  return (
    <div className='flex flex-col lg:flex-row text-black'>
      <div className='hidden lg:block lg:w-1/2 bg-gray-800 min-h-screen'>
        <AutoplaySlider />
      </div>
      <div className='lg:w-1/2 min-h-screen flex justify-center items-center'>
        <div className='text-center w-[50%]'>
          <h1 className='text-md font-bold mb-2'>Login as admin</h1>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-2'>
              <div className='grid gap-1'>
                <Label className='sr-only' htmlFor='email'>
                  Email
                </Label>
                <Input
                  id='email'
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  placeholder='name@example.com'
                  type='email'
                  autoCapitalize='none'
                  autoComplete='email'
                  autoCorrect='off'
                  disabled={isSubmitting}
                />
              </div>
              <div className='grid gap-1'>
                <Label className='sr-only' htmlFor='password'>
                  Email
                </Label>
                <Input
                  id='password'
                  type='password'
                  name='password'
                  value={values.password}
                  onChange={handleChange}
                  placeholder='password'
                  disabled={isSubmitting}
                />
              </div>
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

/* 

<form className="py-2" onSubmit={handleSubmit}>
            <div className="mt-2">
              <label htmlFor="email">Email</label>
              <InputContainer>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                />
              </InputContainer>
            </div>
            <div className="mt-2">
              <label htmlFor="password">Password</label>
              <InputContainer>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full outline-none text-black"
                />
              </InputContainer>
            </div>
            <button
              type="submit"
              className="bg-gray-800 text-white px-3 py-4 mt-3 w-full"
            >
              Login
            </button>           </form>
*/
