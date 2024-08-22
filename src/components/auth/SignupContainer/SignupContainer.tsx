'use client'

import { CreateUserInput } from '@/src/types/common'
import { Button, Card, CardBody, Input } from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUp } from '../../../actions/auth/actions'
import PasswordField from '../PasswordField'

// Define the Zod schema
const signupSchema = z
    .object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        phone: z
            .string()
            .min(1, 'Phone number is required')
            .regex(/^\d+$/, 'Phone number must be numeric'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupContainer() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    })
    const [error, setError] = useState<boolean | null>(null)
    const signUpMutation = useMutation({
        mutationKey: ['signup'],
        mutationFn: signUp,
        onError: () => {
            setError(true)
        },
    })

    async function onSubmit(data: SignupFormValues) {
        setError(null)
        await signUpMutation.mutateAsync({
            ...data,
            confirmPassword: undefined,
        })
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="p-6 sm:min-w-[400px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="gap-3">
                        <Input
                            {...register('firstName')}
                            radius={'md'}
                            type="text"
                            label="First Name"
                            placeholder="Enter your first name"
                            errorMessage={errors.firstName?.message}
                        />

                        <Input
                            {...register('lastName')}
                            radius={'md'}
                            type="text"
                            label="Last Name"
                            placeholder="Enter your last name"
                            errorMessage={errors.lastName?.message}
                        />

                        <Input
                            {...register('email')}
                            radius={'md'}
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            errorMessage={errors.email?.message}
                        />

                        <Input
                            {...register('phone')}
                            radius={'md'}
                            type="tel"
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            errorMessage={errors.phone?.message}
                        />

                        <PasswordField
                            label="Password"
                            placeholder="Enter your password"
                            otherProps={{
                                ...register('password'),
                                errorMessage: errors.password?.message,
                            }}
                        />

                        <PasswordField
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            otherProps={{
                                ...register('confirmPassword'),
                                errorMessage: errors.confirmPassword?.message,
                            }}
                        />

                        <Button
                            type="submit"
                            isLoading={signUpMutation.isPending}
                            color="secondary"
                        >
                            Create an account
                        </Button>

                        {error && (
                            <p className="text-danger">User already exists</p>
                        )}

                        <p className="text-center">
                            Already have an account?{' '}
                            <Link href="/login">Login</Link>
                        </p>
                    </CardBody>
                </form>
            </Card>
        </div>
    )
}
