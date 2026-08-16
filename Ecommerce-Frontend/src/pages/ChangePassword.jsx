import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";
import { useAuth } from "../context/useAuth";

export default function ChangePassword() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        new_password2: "",
    });

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    /*
     * ==============================
     * Handle input
     * ==============================
     */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setError("");
        setSuccess("");
    };


    /*
     * ==============================
     * Submit
     * ==============================
     */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        /*
         * ==============================
         * Frontend validation
         * ==============================
         */

        if (!formData.old_password) {

            setError(
                "Please enter your current password."
            );

            return;
        }


        if (!formData.new_password) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        if (!formData.new_password2) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        if (
            formData.new_password !==
            formData.new_password2
        ) {

            setError(
                "New passwords do not match."
            );

            return;
        }


        /*
         * ==============================
         * Send request
         * ==============================
         */

        try {

            setLoading(true);

            const data =
                await authService.changePassword({
                    current_password:
                        formData.old_password,

                    new_password:
                        formData.new_password,

                    new_password2:
                        formData.new_password2,
                });


            /*
             * ==============================
             * Success
             * ==============================
             */

            setSuccess(
                data.message ||
                "Password changed successfully."
            );


            /*
             * Clear form
             */

            setFormData({
                old_password: "",
                new_password: "",
                new_password2: "",
            });


            /*
             * ==============================
             * Important:
             *
             * Changing the password does
             * NOT automatically invalidate
             * the existing JWT unless your
             * backend explicitly does so.
             *
             * We therefore logout the user
             * and send them to login.
             * ==============================
             */

            setTimeout(() => {

                logout();

                navigate(
                    "/login",
                    {
                        replace: true,
                        state: {
                            passwordChanged: true,
                        },
                    }
                );

            }, 1500);


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );


            const responseData =
                error.response?.data;


            /*
             * ==============================
             * Backend validation errors
             * ==============================
             */

            if (
                responseData &&
                typeof responseData === "object"
            ) {

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

                            messages.push(
                                value
                            );
                        }

                    }
                );


                setError(
                    messages.join(" ") ||
                    "Unable to change password."
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

                        <span className="text-gray-500">
                            Account
                        </span>

                        <span>
                            /
                        </span>

                        <span className="text-gray-900">
                            Change Password
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================
                Main
            ================================= */}

            <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">


                <div className="w-full max-w-md">


                    {/* =================================
                        Card
                    ================================= */}

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
                                        d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-5V8a8 8 0 10-16 0v4a2 2 0 002 2h12a2 2 0 002-2z"
                                    />

                                </svg>

                            </div>

                        </div>


                        {/* =================================
                            Heading
                        ================================= */}

                        <div className="text-center mb-8">

                            <h1 className="text-2xl font-semibold text-gray-900">

                                Change Password

                            </h1>

                            <p className="mt-2 text-sm text-gray-500 leading-6">

                                Update your account password
                                to keep your account secure.

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


                            {/* =================================
                                Current Password
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="old_password"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    Current Password

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>

                                <input
                                    id="old_password"
                                    type="password"
                                    name="old_password"
                                    value={
                                        formData.old_password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =================================
                                New Password
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="new_password"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    New Password

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>

                                <input
                                    id="new_password"
                                    type="password"
                                    name="new_password"
                                    value={
                                        formData.new_password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =================================
                                Confirm New Password
                            ================================= */}

                            <div>

                                <label
                                    htmlFor="new_password2"
                                    className="block text-sm font-semibold text-gray-800 mb-2"
                                >

                                    Confirm New Password

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>

                                <input
                                    id="new_password2"
                                    type="password"
                                    name="new_password2"
                                    value={
                                        formData.new_password2
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* =================================
                                Password Info
                            ================================= */}

                            <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">

                                <p className="text-xs text-gray-500 leading-5">

                                    Make sure your new password
                                    is strong and different from
                                    your current password.

                                </p>

                            </div>


                            {/* =================================
                                Submit
                            ================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
                            >

                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"
                                }

                            </button>

                        </form>


                        {/* =================================
                            Back
                        ================================= */}

                        <div className="mt-6 text-center">

                            <Link
                                to="/dashboard"
                                className="text-sm text-orange-500 hover:underline"
                            >
                                Back to Dashboard
                            </Link>

                        </div>


                    </div>

                </div>

            </div>

        </div>
    );
}