import {
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../context/useAuth";

import authService from "../services/authService";


export default function VerifyOTP() {

    const navigate = useNavigate();

    const location = useLocation();


    const {
        authenticateUser,
    } = useAuth();


    /*
     * Email comes from Register page.
     */
    const registeredEmail =
        location.state?.email || "";


    const [email, setEmail] =
        useState(registeredEmail);


    const [otp, setOtp] =
        useState("");


    const [error, setError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    /*
     * Handle OTP input.
     */
    const handleOTPChange = (event) => {

        /*
         * Only allow numbers.
         */
        const value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);


        setOtp(value);

        setError("");
    };


    /*
     * Verify OTP.
     */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        /*
         * Validate email.
         */
        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        /*
         * Validate OTP.
         */
        if (otp.length !== 6) {

            setError(
                "Please enter the 6-digit OTP."
            );

            return;
        }


        try {

            setLoading(true);


            /*
             * Send OTP to Django.
             */
            const data =
                await authService.verifyEmailOTP(
                    {
                        email:
                            email.trim(),

                        otp,
                    }
                );


            console.log(
                "OTP VERIFICATION RESPONSE:",
                data
            );


            /*
             * Backend must return:
             *
             * access
             * refresh
             * user
             */
            if (
                !data.access ||
                !data.refresh
            ) {

                throw new Error(
                    "Email verification succeeded, but authentication tokens were not returned."
                );
            }


            /*
             * Save JWT and user.
             */
            authenticateUser(data);


            /*
             * Go directly to dashboard.
             */
            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "OTP VERIFICATION ERROR:",
                error
            );


            const responseData =
                error.response?.data;


            /*
             * Collect Django errors.
             */
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
                            typeof value ===
                            "string"
                        ) {

                            messages.push(
                                value
                            );
                        }
                    }
                );


                setError(
                    messages.join(" ") ||
                    "OTP verification failed."
                );

            } else {

                setError(
                    error.message ||
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">

            {/* ==========================
                Breadcrumb
            =========================== */}

            <div className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-4 py-4">

                    <div className="flex gap-3 text-sm">

                        <span className="text-gray-500">
                            Home
                        </span>

                        <span>/</span>

                        <span className="text-gray-500">
                            Account
                        </span>

                        <span>/</span>

                        <span className="text-gray-900">
                            Verify Email
                        </span>

                    </div>

                </div>

            </div>


            {/* ==========================
                OTP Section
            =========================== */}

            <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-10">

                <div className="w-full max-w-md">

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">


                        {/* Icon */}

                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 text-[#3f51c5] flex items-center justify-center text-2xl">

                            ✉

                        </div>


                        {/* Heading */}

                        <h1 className="text-2xl font-bold text-center text-gray-900">

                            Verify Your Email

                        </h1>


                        <p className="text-center text-gray-500 text-sm mt-3">

                            We have sent a 6-digit verification
                            code to your email address.

                        </p>


                        {/* Error */}

                        {error && (

                            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-md px-4 py-3 text-sm">

                                {error}

                            </div>

                        )}


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-7 space-y-5"
                        >


                            {/* Email */}

                            <div>

                                <label className="block text-sm font-semibold mb-2">

                                    E-Mail

                                </label>


                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={
                                        loading
                                    }
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* OTP */}

                            <div>

                                <label className="block text-sm font-semibold mb-2">

                                    Verification Code

                                </label>


                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={
                                        handleOTPChange
                                    }
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    disabled={
                                        loading
                                    }
                                    className="w-full h-14 border border-gray-300 rounded-md px-4 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
                            >

                                {loading
                                    ? "Verifying..."
                                    : "Verify Email"}

                            </button>

                        </form>


                        {/* Information */}

                        <div className="mt-6 text-center">

                            <p className="text-sm text-gray-500">

                                The OTP is valid for{" "}

                                <span className="font-semibold text-gray-700">
                                    10 minutes
                                </span>

                                .

                            </p>

                        </div>


                        {/* Login */}

                        <div className="mt-7 text-center">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                className="text-sm text-orange-500 hover:underline"
                            >
                                Back to Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}