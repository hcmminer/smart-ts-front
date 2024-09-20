import {Link, useNavigate} from 'react-router-dom'

import {cn} from '@/lib/utils'
import {useUserStore} from "@/stores/useUserStore.js";
import {useEffect} from "react";


export function MainNav({
                            className,
                            ...props
                        }) {
    const {user} = useUserStore();

    const navigate = useNavigate();

    // Redirect to /examples/dashboard if the user is logged in
    useEffect(() => {
        if (user) {
            navigate('/examples/dashboard');
        }
    }, [user, navigate]);
    return (
        <nav
            className={cn('flex items-center space-x-4 lg:space-x-6', className)}
            {...props}
        >
            {user && <Link
                to={'/examples/dashboard'}
                className='text-sm font-medium transition-colors hover:text-primary'
            >
                dashboard
            </Link>}
            <Link
                to={'/examples/dashboard'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Customers
            </Link>
            <Link
                to={'/examples/dashboard'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Products
            </Link>
            <Link
                to={'/examples/dashboard'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Settings
            </Link>
        </nav>
    )
}


