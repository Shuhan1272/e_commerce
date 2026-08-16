import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";


export default function ResetPassword() {

    const navigate = useNavigate();


    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // --------------------------------
        // Get reset token
        // --------------------------------

        const resetToken =
            sessionStorage.getItem(
                "passwordResetToken"
            );


        if (!resetToken) {

            setError(
                "Your password reset session has expired. Please request a new OTP."
            );

            return;
        }


        // --------------------------------
        // Validate password
        // --------------------------------

        if (!password) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        if (!confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        // --------------------------------
        // Check passwords
        // --------------------------------

        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            // --------------------------------
            // Reset password
            // --------------------------------

            const data =
                await authService.resetPassword({

                    reset_token:
                        resetToken,

                    password:
                        password,

                    password2:
                        confirmPassword,

                });


            console.log(
                "Password reset response:",
                data
            );


            // --------------------------------
            // Remove reset token
            // --------------------------------

            sessionStorage.removeItem(
                "passwordResetToken"
            );

            sessionStorage.removeItem(
                "passwordResetEmail"
            );


            // --------------------------------
            // Success
            // --------------------------------

            setSuccess(
                "Your password has been reset successfully."
            );


            // --------------------------------
            // Go to login
            // --------------------------------

            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true,
                        state: {
                            passwordReset: true,
                        },
                    }
                );

            }, 1500);


        } catch (error) {

            console.error(
                "Password reset error:",
                error
            );


            const responseData =
                error.response?.data;


            if (responseData) {

                const messages = [];


                Object.entries(
                    responseData
                ).forEach(
                    // eslint-disable-next-line no-unused-vars
                    ([field, value]) => {

                        if (
                            Array.isArray(value)
                        ) {

                            messages.push(
                                value.join(" ")
                            );

                        } else if (
                            typeof value === "string"
                        ) {

                            messages.push(value);

                        }

                    }
                );


                setError(
                    messages.join(" ") ||
                    "Unable to reset password."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-gray-50">


            {/* =================================
                Breadcrumb
            ================================= */}

            <div className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-4 py-4">

                    <div className="flex gap-3 text-sm">

                        <Link
                            to="/"
                            className="text-gray-500 hover:text-blue-600"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="text-gray-500">
                            Account
                        </span>

                        <span>/</span>

                        <span className="text-gray-900">
                            Reset Password
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================
                Main
            ================================= */}

            <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">

                <div className="w-full max-w-md">

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">


                        {/* =================================
                            Icon
                        ================================= */}

                        <div className="flex justify-center mb-6">

                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v3h8z"
                                    />

                                </svg>

                            </div>

                        </div>


                        {/* =================================
                            Heading
                        ================================= */}

                        <div className="text-center mb-8">

                            <h1 className="text-2xl font-semibold text-gray-900">

                                Reset Password

                            </h1>

                            <p className="mt-2 text-sm text-gray-500">

                                Enter your new password below.

                            </p>

                        </div>


                        {/* =================================
                            Error
                        ================================= */}

                        {error && (

                            <div className="mb-6 px-4 py-3 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm">

                                {error}

                            </div>

                        )}


                        {/* =================================
                            Success
                        ================================= */}

                        {success && (

                            <div className="mb-6 px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm">

                                {success}

                            </div>

                        )}


                        {/* =================================
                            Form
                        ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >


                            {/* New Password */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    New Password

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => {

                                        setPassword(
                                            event.target.value
                                        );

                                        setError("");

                                    }}
                                    placeholder="New Password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-12 border border-gray-300 rounded-md px-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    Confirm Password

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(event) => {

                                        setConfirmPassword(
                                            event.target.value
                                        );

                                        setError("");

                                    }}
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-12 border border-gray-300 rounded-md px-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
                            >

                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"
                                }

                            </button>

                        </form>


                        {/* =================================
                            Login
                        ================================= */}

                        <div className="flex items-center gap-4 my-8">

                            <div className="flex-1 h-px bg-gray-200" />

                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                Remember your password?
                            </span>

                            <div className="flex-1 h-px bg-gray-200" />

                        </div>


                        <p className="text-center text-sm text-gray-700">

                            Go back to{" "}

                            <Link
                                to="/login"
                                className="text-orange-500 hover:underline font-medium"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}