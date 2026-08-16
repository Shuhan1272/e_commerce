import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";

export default function VerifyPasswordOTP() {

    const navigate = useNavigate();

    /*
     * Get email directly from sessionStorage.
     *
     * No useEffect and no setEmail().
     */
    const email =
        sessionStorage.getItem(
            "passwordResetEmail"
        );

    const [otp, setOtp] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    /*
     * If the user directly opens this page
     * without requesting a password reset first,
     * send them back to Forgot Password.
     */
    if (!email) {

        navigate(
            "/forgot-password",
            {
                replace: true,
            }
        );

        return null;
    }


    /*
     * Handle OTP input.
     */
    const handleOtpChange = (event) => {

        const value =
            event.target.value.replace(
                /\D/g,
                ""
            );

        if (value.length <= 6) {

            setOtp(value);

        }

        setError("");
    };


    /*
     * Verify OTP
     */
    const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    // --------------------------------
    // Validate OTP
    // --------------------------------

    if (otp.length !== 6) {

        setError(
            "Please enter the 6-digit OTP."
        );

        return;
    }


    try {

        setLoading(true);


        // --------------------------------
        // Verify OTP
        // --------------------------------

        const data = await authService.verifyPasswordOTP({
            email: email,
            otp: otp,
        });


        console.log(
            "OTP verification response:",
            data
        );


        // --------------------------------
        // Check reset token
        // --------------------------------

        if (!data.reset_token) {

            setError(
                "OTP verified, but reset token was not received."
            );

            return;
        }


        // --------------------------------
        // Save reset token
        // --------------------------------

        sessionStorage.setItem(
            "passwordResetToken",
            data.reset_token
        );


        // --------------------------------
        // Navigate to reset password
        // --------------------------------

        navigate(
            "/reset-password",
            {
                replace: true,
            }
        );


    } catch (error) {

        console.error(
            "OTP verification error:",
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

                    if (Array.isArray(value)) {

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
                "Unable to verify the OTP."
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

                        <span>
                            /
                        </span>

                        <Link
                            to="/forgot-password"
                            className="text-gray-500 hover:text-blue-600"
                        >
                            Forgot Password
                        </Link>

                        <span>
                            /
                        </span>

                        <span className="text-gray-900">
                            Verify OTP
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
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z"
                                    />

                                </svg>

                            </div>

                        </div>


                        {/* =================================
                            Heading
                        ================================= */}

                        <div className="text-center mb-8">

                            <h1 className="text-2xl font-semibold text-gray-900">
                                Verify OTP
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 leading-6">
                                We have sent a 6-digit
                                verification code to
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800 break-all">
                                {email}
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
                            Form
                        ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* OTP */}

                            <div>

                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    Verification Code

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    disabled={loading}
                                    className="w-full h-12 border border-gray-300 rounded-md px-4 text-center text-xl tracking-[0.5em] font-semibold outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    otp.length !== 6
                                }
                                className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
                            >

                                {loading
                                    ? "Verifying..."
                                    : "Verify OTP"
                                }

                            </button>

                        </form>


                        {/* =================================
                            Change email
                        ================================= */}

                        <div className="text-center mt-6">

                            <Link
                                to="/forgot-password"
                                className="text-sm text-orange-500 hover:underline"
                            >
                                Use a different email
                            </Link>

                        </div>


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