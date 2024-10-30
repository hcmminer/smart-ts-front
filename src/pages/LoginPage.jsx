import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons.jsx";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, login } = useUserStore();

    const auth = async () => {
        console.log("Initiating Google login...");
        const response = await fetch('http://127.0.0.1:5000/api/oauth/google/login', { method: 'POST' });
        const data = await response.json();
        window.location.href = data.url;  // Redirect to Google OAuth
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">Login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <p className="text-sm text-center text-muted-foreground w-full">
                            Not a member?{" "}
                            <Link to="/signup" className="font-medium text-primary hover:underline">
                                Sign up now <ArrowRight className="inline h-4 w-4" />
                            </Link>
                        </p>
                        {!loading && (
                            <>
                                <div className="flex items-center justify-center w-80">
                                    <span className="flex-1 border-b border-gray-300 h-2" aria-hidden="true" />
                                    <span className="mx-2 text-xs font-normal uppercase text-center h-3">Hoặc</span>
                                    <span className="flex-1 border-b border-gray-300 h-2" aria-hidden="true" />
                                </div>
                                <Button
                                    onClick={auth}
                                    className="relative flex items-center w-80 border border-gray-300 rounded-lg text-lg font-normal bg-white h-12 transition-shadow duration-150 ease-in-out hover:shadow-inner hover:bg-gray-50 text-gray-700 mb-2 px-2 pl-13"
                                >
                                    <span className="absolute left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        {Icons.google({ width: 24, height: 24 })}
                                    </span>
                                    <span className="relative text-left pl-8">Tiếp tục với Google</span>
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
