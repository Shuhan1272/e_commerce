import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // ==============================
  // Form & UI state
  // ==============================
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // Handle email change
  // ==============================
  const handleChange = (event) => {
    setEmail(event.target.value);
    // Clear messages when user types
    if (error) setError("");
    if (success) setSuccess("");
  };

  // ==============================
  // Submit handler
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    // Basic required check
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const data = await authService.forgotPassword(trimmedEmail);

      const successMessage =
        data?.message ||
        "If an account exists with this email, a password reset OTP has been sent.";

      // Store in session storage for persistence
      sessionStorage.setItem("passwordResetEmail", trimmedEmail);

      // Redirect immediately and pass message via router state
      navigate("/verify-password-otp", {
        state: { message: successMessage, email: trimmedEmail },
      });
    } catch (err) {
      console.error("Forgot password error:", err);

      const responseData = err.response?.data;

      if (responseData && typeof responseData === "object") {
        if (responseData.email) {
          const emailVal = responseData.email;

          if (Array.isArray(emailVal)) {
            setError(
              emailVal
                .map((item) =>
                  typeof item === "object" ? JSON.stringify(item) : item
                )
                .join(" ")
            );
          } else if (typeof emailVal === "object") {
            setError(
              Object.values(emailVal)
                .map((val) => (Array.isArray(val) ? val.join(" ") : String(val)))
                .join(" ")
            );
          } else {
            setError(String(emailVal));
          }
        } else if (responseData.detail) {
          setError(
            typeof responseData.detail === "object"
              ? JSON.stringify(responseData.detail)
              : String(responseData.detail)
          );
        } else if (responseData.message) {
          setError(
            typeof responseData.message === "object"
              ? JSON.stringify(responseData.message)
              : String(responseData.message)
          );
        } else {
          // Dynamic extraction for other backend error keys
          const firstKey = Object.keys(responseData)[0];
          const firstVal = responseData[firstKey];

          if (Array.isArray(firstVal)) {
            setError(`${firstKey}: ${firstVal.join(" ")}`);
          } else if (typeof firstVal === "string") {
            setError(`${firstKey}: ${firstVal}`);
          } else {
            setError("Unable to process your request.");
          }
        }
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/login" className="text-gray-500 hover:text-blue-600">
              Login
            </Link>
            <span>/</span>
            <span className="text-gray-900">Forgot Password</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            {/* Icon */}
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
                    d="M16 12H8m8 0-3-3m3 3-3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Forgot Password?
              </h1>
              <p className="mt-2 text-sm text-gray-500 leading-6">
                Enter your email address and we'll send you a verification code
                to reset your password.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mb-6 px-4 py-3 rounded-md border border-green-200 bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  E-Mail <span className="text-red-500">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#3f51c5] hover:bg-[#3446b7] disabled:bg-gray-400 text-white rounded-md font-bold transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            {/* Back to Login Section */}
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