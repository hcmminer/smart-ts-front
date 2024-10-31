import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarDateRangePicker} from "@/components/date-range-picker.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {Overview} from "@/components/overview.jsx";
import {RecentSales} from "@/components/recent-sales.jsx";
import {useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";

const DashBoard = () => {
    const [user, setUser] = useState(null); // State để lưu thông tin người dùng
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        // Lấy các tham số từ URL
        const params = new URLSearchParams(window.location.search);
        const accessTokenFromUrl = params.get("accessToken");
        const refreshTokenFromUrl = params.get("refreshToken");

        if (accessTokenFromUrl && refreshTokenFromUrl) {
            setAccessToken(accessTokenFromUrl);
            setRefreshToken(refreshTokenFromUrl);
            saveTokens(accessTokenFromUrl, refreshTokenFromUrl);
            decodeAndSetUser(accessTokenFromUrl);

            // Xóa token khỏi URL để tăng bảo mật
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Nếu không có token trong URL, kiểm tra localStorage
            const storedAccessToken = localStorage.getItem("accessToken");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                decodeAndSetUser(storedAccessToken);
            }
        }
    }, []);

    // Hàm lưu token vào localStorage
    const saveTokens = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    };

    // Hàm giải mã và lưu thông tin người dùng vào state
    const decodeAndSetUser = (token) => {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUser(decodedToken.user); // Lưu thông tin người dùng vào state
    };

    // Hàm làm mới token
    const refreshAccessToken = async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (!storedRefreshToken) {
            console.log("No refresh token available");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedRefreshToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const { accessToken: newAccessToken } = await response.json();
            setAccessToken(newAccessToken);
            saveTokens(newAccessToken, storedRefreshToken); // Lưu token mới vào localStorage
            decodeAndSetUser(newAccessToken); // Giải mã và cập nhật thông tin người dùng
        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    };

    // Kiểm tra token khi component mount
    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decoded = jwtDecode(token);
                const expTime = decoded.exp * 1000; // Chuyển đổi thời gian hết hạn từ giây sang mili giây
                const currentTime = Date.now();

                // Nếu token gần hết hạn, làm mới token
                if (expTime - currentTime < 5 * 60 * 1000) { // Kiểm tra 5 phút trước khi hết hạn
                    refreshAccessToken();
                }
            }
        }, 60000); // Kiểm tra mỗi phút

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);

    return (
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <div>
                    {user ? (
                        <div>
                            <h1>Welcome, {user.name}</h1>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            {/* Hiển thị ảnh đại diện */}
                            {user.image && (
                                <img
                                    src={user.image}
                                    alt={`${user.name}'s avatar`}
                                    className="w-16 h-16 rounded-full mt-4"
                                />
                            )}
                        </div>
                    ) : (
                        <p>Loading user information...</p>
                    )}
                </div>
            </div>
            <div className='flex items-center justify-between space-y-2'>
                <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
                <div className='flex items-center space-x-2'>
                    <CalendarDateRangePicker/>
                    <Button>Download</Button>
                </div>
            </div>
            <Tabs defaultValue='overview' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='analytics' disabled>
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value='reports' disabled>
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value='notifications' disabled>
                        Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='overview' className='space-y-4'>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Total Revenue
                                </CardTitle>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='h-4 w-4 text-muted-foreground'
                                >
                                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/>
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>$45,231.89</div>
                                <p className='text-xs text-muted-foreground'>
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Subscriptions
                                </CardTitle>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='h-4 w-4 text-muted-foreground'
                                >
                                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/>
                                    <circle cx='9' cy='7' r='4'/>
                                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'/>
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>+2350</div>
                                <p className='text-xs text-muted-foreground'>
                                    +180.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='h-4 w-4 text-muted-foreground'
                                >
                                    <rect width='20' height='14' x='2' y='5' rx='2'/>
                                    <path d='M2 10h20'/>
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>+12,234</div>
                                <p className='text-xs text-muted-foreground'>
                                    +19% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>
                                    Active Now
                                </CardTitle>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    className='h-4 w-4 text-muted-foreground'
                                >
                                    <path d='M22 12h-4l-3 9L9 3l-3 9H2'/>
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>+573</div>
                                <p className='text-xs text-muted-foreground'>
                                    +201 since last hour
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                        <Card className='col-span-4'>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className='pl-2'>
                                <Overview/>
                            </CardContent>
                        </Card>
                        <Card className='col-span-3'>
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>
                                    You made 265 sales this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSales/>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashBoard;