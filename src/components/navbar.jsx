import {UserPlus, LogIn} from "lucide-react";
import {Link} from "react-router-dom";
import TeamSwitcher from "@/components/team-switcher.jsx";
import {MainNav} from "@/components/main-nav.jsx";
import {Search} from "@/components/search.jsx";
import {ModeToggle} from "@/components/mode-toggle.jsx";
import {Button} from "@/components/ui/button.jsx";
import {UserNav} from "@/components/user-nav.jsx";
import {useToken} from "../../context/TokenContext.js";

const Navbar = () => {

    const { user } = useToken();
    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <TeamSwitcher/>
                <MainNav className='mx-6'/>

                <div className='ml-auto flex items-center space-x-4'>
                    <Search/>
                    <ModeToggle/>
                    {!user && (
                        <>
                            <Button asChild variant="outline">
                                <Link to="/signup">
                                    <UserPlus className="mr-2 h-4 w-4"/>
                                    Sign Up
                                </Link>
                            </Button>

                            <Button asChild variant="outline">
                                <Link to="/login">
                                    <LogIn className='mr-2 h-4 w-4'/>
                                    Login
                                </Link>
                            </Button>
                        </>
                    )}
                    {user && <UserNav/>}

                </div>
            </div>
        </div>
    );
};
export default Navbar;
