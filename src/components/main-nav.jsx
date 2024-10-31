import {Link, useNavigate} from 'react-router-dom'

import {cn} from '@/lib/utils'
import {useEffect} from "react";
import {useToken} from "../../context/TokenContext.js";


export function MainNav({
                            className,
                            ...props
                        }) {
    const {user} = useToken();

    const navigate = useNavigate();

    // Redirect to /examples/dashboard if the user is logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);
    return (
        <nav
            className={cn('flex items-center space-x-4 lg:space-x-6', className)}
            {...props}
        >
            {user && <Link
                to={'/dashboard'}
                className='text-sm font-medium transition-colors hover:text-primary'
            >
                dashboard
            </Link>}
            <Link
                to={'/customers'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Customers
            </Link>
            <Link
                to={'/products'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Products
            </Link>
            <Link
                to={'/settings'}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
            >
                Settings
            </Link>
        </nav>
    )
}


