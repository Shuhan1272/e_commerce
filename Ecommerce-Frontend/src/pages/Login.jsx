import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {

            setLoading(true);

            await login({
                email: formData.email,
                password: formData.password,
            });

            

            navigate("/dashboard", {
                replace: true,
            });

        } catch (error) {

            const data =
                error.response?.data;


            if (!data) {

                setError(
                    "Unable to connect to the server."
                );

                return ; 
            }

            if (data?.detail) {
                setError(data.detail);

            } else if (
                data?.non_field_errors
            ) {
                setError(
                    data.non_field_errors[0]
                );

            } else if (data?.email) {
                setError(
                    Array.isArray(data.email)
                        ? data.email[0]
                        : data.email
                );

            } else {
                console.log(
                    "Unexpected error response:",
                    data
                );
                setError(
                    "Invalid email or password."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Breadcrumb */}
            <div className="border-b bg-white">

                <div className="max-w-7xl mx-auto px-4 py-4">

                    <div className="flex items-center gap-3 text-sm">

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
                            Login
                        </span>

                    </div>

                </div>

            </div>

            {/* Login */}
            <div className="max-w-md mx-auto px-4 py-12">

                <div className="bg-white border border-gray-200 rounded-lg p-7 shadow-sm">

                    <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                        Account Login
                    </h1>

                    {error && (
                        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Email
                            </label>

                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E-Mail"
                                autoComplete="email"
                                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Password */}
                        <div>

                            <div className="flex justify-between mb-2">

                                <label className="text-sm font-semibold">
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-orange-500 hover:text-orange-600"
                                >
                                    Forgotten Password?
                                </Link>

                            </div>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                autoComplete="current-password"
                                className="w-full h-11 rounded-md border border-gray-300 px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Captcha demo */}
                        <div className="h-16 border border-gray-300 bg-gray-50 rounded-md flex items-center justify-between px-4">

                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                    ✓
                                </div>

                                <span className="text-sm">
                                    Success!
                                </span>

                            </div>

                            <div className="text-xs font-black tracking-widest">
                                CLOUDFLARE
                            </div>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-md bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white font-bold transition"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    <div className="flex items-center gap-4 my-8">

                        <div className="flex-1 h-px bg-gray-200" />

                        <span className="text-sm text-gray-500 whitespace-nowrap">
                            Don't have an account?
                        </span>

                        <div className="flex-1 h-px bg-gray-200" />

                    </div>

                    <Link
                        to="/register"
                        className="block h-11 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-center leading-[44px] font-semibold transition"
                    >
                        Create Your Account
                    </Link>

                </div>

            </div>

        </div>
    );
}