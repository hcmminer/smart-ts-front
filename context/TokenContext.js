import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessTokenFromUrl = params.get("accessToken");
        const refreshTokenFromUrl = params.get("refreshToken");

        if (accessTokenFromUrl && refreshTokenFromUrl) {
            setAccessToken(accessTokenFromUrl);
            setRefreshToken(refreshTokenFromUrl);
            saveTokens(accessTokenFromUrl, refreshTokenFromUrl);
            decodeAndSetUser(accessTokenFromUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const storedAccessToken = localStorage.getItem("accessToken");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                decodeAndSetUser(storedAccessToken);
            }
        }
    }, []);

    const saveTokens = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    };

    const decodeAndSetUser = (token) => {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) {
            console.log("No refresh token available");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const { accessToken: newAccessToken } = await response.json();
            setAccessToken(newAccessToken);
            saveTokens(newAccessToken, refreshToken);
            decodeAndSetUser(newAccessToken);
        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                const expTime = decoded.exp * 1000;
                const currentTime = Date.now();

                if (expTime - currentTime < 5 * 60 * 1000) {
                    refreshAccessToken();
                }
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [accessToken, refreshToken]);

    return React.createElement(
        TokenContext.Provider,
        { value: { user, accessToken, refreshAccessToken } },
        children
    );
};

export const useToken = () => useContext(TokenContext);
