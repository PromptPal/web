import { graphql } from '@/gql'
import { PasswordAuthInput } from '@/gql/graphql'
import { tokenAtom } from '@/stats/profile'
import InputField from '@annatarhe/lake-ui/form-input-field'
import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod/v4'

const PASSWORD_AUTH_MUTATION = graphql(`
  mutation PasswordAuth($auth: PasswordAuthInput!) {
    passwordAuth(auth: $auth) {
      token
      user {
        id
        name
        addr
        avatar
        email
        phone
        lang
        level
        source
      }
    }
  }
`)

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

function EmailPasswordLoginForm() {
  const navigate = useNavigate()
  const [, setToken] = useAtom(tokenAtom)
  const [showPassword, setShowPassword] = useState(false)

  const [passwordAuth, { loading }] = useMutation(PASSWORD_AUTH_MUTATION, {
    onCompleted: (data) => {
      if (data.passwordAuth.token) {
        setToken(data.passwordAuth.token)
        toast.success('Login successful!')
        navigate({ to: '/projects' })
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed. Please check your credentials.')
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const authInput: PasswordAuthInput = {
      email: data.email,
      password: data.password,
    }

    await passwordAuth({
      variables: {
        auth: authInput,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <div className='relative'>
              <InputField
                {...field}
                type='email'
                label={(
                  <div className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                    <Mail className='w-4 h-4' />
                    Email Address
                  </div>
                )}
                placeholder='you@example.com'
                autoComplete='email'
                className='w-full'
                error={fieldState.error?.message}
                // inputProps={{
                //   className: 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:ring-sky-500/20',
                // }}
              />
            </div>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Controller
          name='password'
          control={control}
          render={({ field, fieldState }) => (
            <div className='relative'>
              <InputField
                {...field}
                type={showPassword ? 'text' : 'password'}
                label={(
                  <div className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                    <Lock className='w-4 h-4' />
                    Password
                  </div>
                )}
                placeholder='Enter your password'
                autoComplete='current-password'
                className='w-full'
                error={fieldState.error?.message}
                // inputProps={{
                //   className: 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-sky-500 focus:ring-sky-500/20 pr-10',
                // }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-[38px] text-gray-400 hover:text-gray-300 transition-colors'
              >
                {showPassword
                  ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                      </svg>
                    )
                  : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                    )}
              </button>
            </div>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className='space-y-4'
      >
        <button
          type='submit'
          disabled={!isValid || loading}
          className='group relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300' />
          <span className='relative z-10 flex items-center gap-2'>
            {loading
              ? (
                  <>
                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    Signing in...
                  </>
                )
              : (
                  <>
                    Sign in with Email
                    <ArrowRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                  </>
                )}
          </span>
        </button>

      </motion.div>
    </form>
  )
}

export default EmailPasswordLoginForm
