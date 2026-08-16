import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Navbar() {

    const navigate = useNavigate();

    const {
        user,
        logout,
        isAuthenticated,
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="bg-[#071521] text-white">

            <div className="max-w-7xl mx-auto px-4">

                <div className="h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="font-black text-2xl"
                    >
                        <span className="text-orange-500">
                            STAR
                        </span>

                        <span className="text-blue-400">
                            TECH
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">

                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            className="text-gray-300 hover:text-white"
                        >
                            Products
                        </Link>

                        <Link
                            to="/categories"
                            className="text-gray-300 hover:text-white"
                        >
                            Categories
                        </Link>

                        <Link
                            to="/cart"
                            className="text-gray-300 hover:text-white"
                        >
                            Cart
                        </Link>

                        

                    </nav>

                    {/* Account */}
                    <div className="flex items-center gap-4">

                        {isAuthenticated ? (

                            <>
                                <div className="hidden lg:block text-right">

                                    <p className="text-xs text-gray-400">
                                        Welcome
                                    </p>

                                    <p className="font-semibold">
                                        {user?.first_name ||
                                            user?.email ||
                                            "User"}
                                    </p>

                                </div>

                                <Link
                                    to="/dashboard"
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
                                >
                                    Account
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-semibold"
                                >
                                    Logout
                                </button>
                            </>

                        ) : (

                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md font-semibold"
                                >
                                    Register
                                </Link>
                            </>

                        )}

                    </div>

                </div>

            </div>

        </header>
    );
}