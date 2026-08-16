import api from "./api";

const authService = {

    /*
     * LOGIN
     */
    login: async (credentials) => {

        const response =
            await api.post(
                "/accounts/token/",
                credentials
            );

        return response.data;
    },


    /*
     * REGISTER
     */
    register: async (userData) => {

        const response =
            await api.post(
                "/accounts/register/",
                userData
            );

        return response.data;
    },


    /*
     * Verify Email OTP
     */
    verifyEmailOTP: async (data) => {

        const response =
            await api.post(
                "/accounts/verify-email/",
                data
            );

        return response.data;
    },

    verifyPasswordOTP: async (data) => {

    const response = await api.post(
        "/accounts/verify-password-otp/",
        data
    ); 

    return response.data;
    },

    /*
     * Forgot Password
     *
     * Sends password reset OTP to user's email.
     */
    forgotPassword: async (email) => {

        const response = await api.post(
            "/accounts/forgot-password/",
            {
                email: email
            }
        );

        return response.data;
    },

    resetPassword: async (data) => {

    const response = await api.post(
        "/accounts/reset-password/",
        data
    );

        return response.data;
    },

    changePassword: async (data) => {

    const response = await api.post(
        "/accounts/change-password/",
        data
    );

    return response.data;
    },

    

    /*
     * REFRESH TOKEN
     */
    refreshToken: async (
        refresh
    ) => {

        const response =
            await api.post(
                "/accounts/token/refresh/",
                {
                    refresh,
                }
            );

        return response.data;
    },
};


export default authService;