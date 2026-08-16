import {
    createContext,
    useState,
} from "react";

import authService from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    /*
     * Read stored authentication before
     * React initializes.
     */
    const getStoredUser = () => {

        const storedUser =
            localStorage.getItem("user");

        const accessToken =
            localStorage.getItem("accessToken");

        const refreshToken =
            localStorage.getItem("refreshToken");

        if (
            !storedUser ||
            !accessToken ||
            !refreshToken
        ) {
            return null;
        }

        try {

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            return null;
        }
    };


    const [user, setUser] = useState(
        getStoredUser
    );


    const [loading] = useState(false);


    /*
     * LOGIN
     */
    const login = async (credentials) => {

        const data =
            await authService.login(
                credentials
            );

        /*
         * Save access token
         */
        localStorage.setItem(
            "accessToken",
            data.access
        );

        /*
         * Save refresh token
         */
        localStorage.setItem(
            "refreshToken",
            data.refresh
        );


        /*
         * Save user
         */
        if (data.user) {

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setUser(data.user);

        } else {

            const authenticatedUser = {
                authenticated: true,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(
                    authenticatedUser
                )
            );

            setUser(authenticatedUser);
        }


        return data;
    };


    /*
     * REGISTER
     *
     * Registration itself should NOT
     * automatically authenticate the user
     * if your backend now requires email
     * verification.
     */
    const register = async (userData) => {

        const data =
            await authService.register(
                userData
            );

        /*
         * IMPORTANT:
         *
         * We do NOT save JWT here anymore.
         *
         * The user must verify their email first.
         */

        return data;
    };


    /*
     * AUTHENTICATE USER
     *
     * Used after successful email verification.
     */
    const authenticateUser = (data) => {

        /*
         * Save access token
         */
        localStorage.setItem(
            "accessToken",
            data.access
        );


        /*
         * Save refresh token
         */
        localStorage.setItem(
            "refreshToken",
            data.refresh
        );


        /*
         * Save user
         */
        if (data.user) {

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setUser(data.user);

        } else {

            const authenticatedUser = {
                authenticated: true,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(
                    authenticatedUser
                )
            );

            setUser(authenticatedUser);
        }
    };


    /*
     * LOGOUT
     */
    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);
    };


    /*
     * AUTHENTICATION STATUS
     */
    const isAuthenticated =
        Boolean(
            localStorage.getItem(
                "accessToken"
            )
        );


    /*
     * CONTEXT VALUE
     */
    const value = {

        user,

        loading,

        login,

        register,

        authenticateUser,

        logout,

        isAuthenticated,
    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}