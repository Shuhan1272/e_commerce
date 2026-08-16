import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <Link
                to="/change-password"
                className="text-sm text-blue-600 hover:underline"
            >
                Change Password
            </Link>

            <main className="max-w-7xl mx-auto px-4 py-10">

                <div className="mb-8">

                    <p className="text-gray-500">
                        Account Dashboard
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Welcome back,{" "}
                        {user?.first_name || "User"}!
                    </h1>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Card
                        title="My Orders"
                        value="0"
                        description="Total orders"
                    />

                    <Card
                        title="Wishlist"
                        value="0"
                        description="Saved products"
                    />

                    <Card
                        title="Cart"
                        value="0"
                        description="Items in cart"
                    />

                    <Card
                        title="Reviews"
                        value="0"
                        description="Your reviews"
                    />

                </div>

                <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">

                    <h2 className="text-xl font-bold mb-6">
                        Account Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <Info
                            label="First Name"
                            value={user?.first_name}
                        />

                        <Info
                            label="Last Name"
                            value={user?.last_name}
                        />

                        <Info
                            label="Email"
                            value={user?.email}
                        />

                        <Info
                            label="Telephone"
                            value={user?.telephone}
                        />

                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold"
                >
                    Logout
                </button>

            </main>

        </div>
    );
}

function Card({
    title,
    value,
    description,
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

            <p className="text-sm text-gray-400 mt-2">
                {description}
            </p>

        </div>
    );
}

function Info({
    label,
    value,
}) {
    return (
        <div className="border-b border-gray-100 pb-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-semibold mt-1">
                {value || "Not provided"}
            </p>

        </div>
    );
}