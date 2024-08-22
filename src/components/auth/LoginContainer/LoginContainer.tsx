'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, Checkbox, Input } from '@nextui-org/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { authenticate, signIn } from '../../../actions/auth/actions'
import { ProfileAction } from '../../../actions/profile/enum'
import PasswordField from '../PasswordField'

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginContainer() {
    const router = useRouter()
    const client = useQueryClient()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const mutation = useMutation({
        mutationFn: authenticate,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: [ProfileAction.getUser],
            })
            router.refresh()
        },
    })

    const onSubmit = (data: LoginFormValues) => {
        mutation.mutate(data)
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="p-6 sm:min-w-[400px]">
                    <CardBody className="gap-3">
                        <Input
                            autoFocus
                            label="Email"
                            placeholder="Enter your email"
                            {...register('email')}
                            errorMessage={errors.email?.message}
                        />
                        <PasswordField
                            label="Password"
                            placeholder="Enter your password"
                            otherProps={{
                                ...register('password'),
                                errorMessage: errors.password?.message,
                            }}
                        />
                        <div className="flex flex-col py-2 px-1 sm:flex-row sm:justify-between">
                            <Checkbox
                                defaultSelected
                                classNames={{ label: 'text-small' }}
                            >
                                Remember me
                            </Checkbox>
                            <Link
                                color="primary"
                                href="/forgot-password"
                                className="mt-2 sm:mt-0"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {mutation.isError && (
                            <p className="text-danger">
                                {mutation.error.message}
                            </p>
                        )}

                        <Button
                            isLoading={mutation.isPending}
                            type="submit"
                            fullWidth
                            color="secondary"
                        >
                            Sign In
                        </Button>

                        <p className="text-center">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup">Sign Up</Link>
                        </p>
                    </CardBody>
                </Card>
            </form>
        </div>
    )
}
