
import {Routes, Route} from "react-router-dom";
import SignUpPage from "@/pages/SignUpPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import HomePage from "@/pages-o/HomePage.jsx";
import Navbar from "@/components/navbar.jsx";
import DashBoard from "@/pages/DashBoard.jsx";



export default function App() {

    return (
        <>
            <div className='hidden flex-col md:flex'>
                <Navbar/>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/dashboard' element={<DashBoard/>}/>
                    <Route path='/signup' element={<SignUpPage/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                </Routes>

            </div>
        </>
    )
}
