import { Link } from '@nextui-org/link'
import {
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Navbar as NextUINavbar,
} from '@nextui-org/navbar'

import { isAuthenticated, unauthenticate } from '@/src/actions/auth'
import { Logo } from '@components/core/Logo'
import { ThemeSwitch } from '@components/core/ThemeSwitch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { FaSearch, FaShoppingBag, FaUser } from 'react-icons/fa'
import { IoLogOut } from 'react-icons/io5'
import { CartDrawerContext } from '../../layouts/DefaultLayout'
import { AuthAction } from '@/src/actions/auth/enum'

export function Navbar() {
    const { data, isSuccess } = useQuery({
        queryKey: [AuthAction.auth],
        queryFn: () => isAuthenticated(),
    })

    const queryClient = useQueryClient()

    const logoutMutation = useMutation({
        mutationKey: [AuthAction.logout],
        mutationFn: unauthenticate,
        onSuccess: () => {
            queryClient.invalidateQueries()
        },
    })

    return (
        <NextUINavbar className="h-20" maxWidth="xl" position="sticky">
            <NavbarContent justify="center">
                <NavbarBrand>
                    <Logo />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="flex" justify="end">
                <NavbarItem className="flex gap-5">
                    <Link href="/profile">
                        <FaUser className="text-default-500" />
                    </Link>
                    <Link href="#">
                        <FaSearch className="text-default-500" />
                    </Link>
                    <Link
                        href="#"
                        onClick={useContext(CartDrawerContext).openCart}
                    >
                        <FaShoppingBag className="text-default-500" />
                    </Link>

                    {isSuccess && !!data && (
                        <Link
                            href="#"
                            onClick={async () => {
                                await logoutMutation.mutateAsync()
                            }}
                        >
                            <IoLogOut size={20} className="text-default-500" />
                        </Link>
                    )}
                    <ThemeSwitch />
                </NavbarItem>
            </NavbarContent>
        </NextUINavbar>
    )
}
