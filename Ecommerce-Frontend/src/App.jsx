import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyPasswordOTP from "./pages/VerifyPasswordOTP";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

function Home() {

    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-24 text-center">

                <p className="text-blue-600 font-semibold">
                    Welcome to our store
                </p>

                <h1 className="text-5xl font-black mt-3">
                    Your Complete E-Commerce
                    Experience
                </h1>

                <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
                    Browse products, manage your cart,
                    place orders and manage your account.
                </p>

            </main>

        </div>
    );
}

export default function App() {

    return (
        <BrowserRouter>

            <Routes>
                console.log("App.jsx: Rendering Routes");
                {/* Public */}
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOTP />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/verify-password-otp"
                    element={<VerifyPasswordOTP />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route 
                    path="/change-password"
                    element={<ChangePassword />}
                />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}