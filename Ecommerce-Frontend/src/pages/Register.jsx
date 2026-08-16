import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        agree: false,
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    /*
     * Handle input changes
     */
    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData({
            ...formData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };


    /*
     * Handle registration
     */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        /*
         * Required field validation
         */
        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.password ||
            !formData.confirm_password
        ) {

            setError(
                "Please fill in all required fields."
            );

            return;
        }


        /*
         * Password confirmation
         */
        if (
            formData.password !==
            formData.confirm_password
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        /*
         * Privacy policy
         */
        if (!formData.agree) {

            setError(
                "Please agree to the Privacy Policy."
            );

            return;
        }


        try {

            setLoading(true);


            /*
             * Send registration data
             * to Django.
             */
            const data = await register({

                first_name:
                    formData.first_name.trim(),

                last_name:
                    formData.last_name.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                password:
                    formData.password,

                password2:
                    formData.confirm_password,
            });


            console.log(
                "REGISTER RESPONSE:",
                data
            );


            /*
             * IMPORTANT
             *
             * Registration does NOT log
             * the user in anymore.
             *
             * The backend sends an email
             * verification link.
             *
             * Therefore we send the user
             * to login page with a success
             * message.
             */
            navigate(
                "/verify-otp",
                {
                    replace: true,

                    state: {
                        email:
                            formData.email.trim(),
                    },
                }
            );


        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );


            const data =
                error.response?.data;


            /*
             * No server response
             */
            if (!data) {

                setError(
                    "Unable to connect to the server."
                );

                return;
            }


            /*
             * Collect Django validation
             * errors.
             */
            const messages = [];


            Object.entries(data).forEach(
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
                "Registration failed."
            );


        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">


            {/* ================================
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
                            Register
                        </span>

                    </div>

                </div>

            </div>


            {/* ================================
                Register
            ================================= */}

            <div className="max-w-2xl mx-auto px-4 py-10">

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">


                    {/* Title */}

                    <h1 className="text-2xl font-semibold mb-8">
                        Register Account
                    </h1>


                    {/* =========================
                        Error
                    ========================== */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md px-4 py-3 text-sm">

                            {error}

                        </div>

                    )}


                    {/* =========================
                        Form
                    ========================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >


                        {/* =====================
                            First / Last Name
                        ====================== */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                            {/* First Name */}

                            <div>

                                <label className="block text-sm font-semibold mb-2">

                                    First Name

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="first_name"
                                    value={
                                        formData.first_name
                                    }
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    autoComplete="given-name"
                                    disabled={loading}
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>


                            {/* Last Name */}

                            <div>

                                <label className="block text-sm font-semibold mb-2">

                                    Last Name

                                    <span className="text-red-500">
                                        {" "}*
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="last_name"
                                    value={
                                        formData.last_name
                                    }
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    autoComplete="family-name"
                                    disabled={loading}
                                    className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                                />

                            </div>

                        </div>


                        {/* =====================
                            Email
                        ====================== */}

                        <div>

                            <label className="block text-sm font-semibold mb-2">

                                E-Mail

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={handleChange}
                                placeholder="E-Mail"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            />

                        </div>

                        {/* =====================
                            Phone
                        ====================== */}

                        <div>

                            <label className="block text-sm font-semibold mb-2">

                                Phone

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={handleChange}
                                placeholder="Phone"
                                autoComplete="tel"
                                disabled={loading}
                                className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            />

                        </div>

                        {/* =====================
                            Password
                        ====================== */}

                        <div>

                            <label className="block text-sm font-semibold mb-2">

                                Password

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={handleChange}
                                placeholder="Password"
                                autoComplete="new-password"
                                disabled={loading}
                                className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =====================
                            Confirm Password
                        ====================== */}

                        <div>

                            <label className="block text-sm font-semibold mb-2">

                                Confirm Password

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="password"
                                name="confirm_password"
                                value={
                                    formData.confirm_password
                                }
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                disabled={loading}
                                className="w-full h-11 border border-gray-300 rounded-md px-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =====================
                            Privacy Policy
                        ====================== */}

                        <label className="flex items-start gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                name="agree"
                                checked={
                                    formData.agree
                                }
                                onChange={handleChange}
                                disabled={loading}
                                className="mt-1 w-4 h-4"
                            />


                            <span className="text-sm">

                                I have read and agree to the{" "}

                                <span className="text-orange-500">
                                    Privacy Policy
                                </span>

                            </span>

                        </label>


                        {/* =====================
                            Captcha
                        ====================== */}

                        <div className="h-16 border border-gray-300 bg-gray-50 rounded-md px-4 flex justify-between items-center">

                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">

                                    ✓

                                </div>

                                <span className="text-sm">
                                    Success!
                                </span>

                            </div>


                            <span className="font-black text-xs tracking-widest">
                                CLOUDFLARE
                            </span>

                        </div>


                        {/* =====================
                            Submit
                        ====================== */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
                        >

                            {loading
                                ? "Creating Account..."
                                : "Continue"}

                        </button>

                    </form>


                    {/* ================================
                        Login separator
                    ================================= */}

                    <div className="flex items-center gap-4 my-8">

                        <div className="flex-1 h-px bg-gray-200" />

                        <span className="text-sm text-gray-500 whitespace-nowrap">

                            Already have an account?

                        </span>

                        <div className="flex-1 h-px bg-gray-200" />

                    </div>


                    {/* ================================
                        Login message
                    ================================= */}

                    <p className="text-sm text-gray-700">

                        If you already have an account
                        with us, please login at the{" "}

                        <Link
                            to="/login"
                            className="text-orange-500 hover:underline"
                        >
                            login page
                        </Link>

                        .

                    </p>


                </div>

            </div>

        </div>
    );
}