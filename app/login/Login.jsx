"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthForm() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (isSignup && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const endpoint = isSignup
                ? "https://automate-business-backend.vercel.app/api/auth/register"
                : "https://automate-business-backend.vercel.app/api/auth/login";

            const payload = isSignup
                ? { ...formData } // Pass full data for Sign Up
                : { email: formData.email, password: formData.password }; // Pass only email & password for Login

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Authentication failed");

            console.log(`${isSignup ? "Signup" : "Login"} successful`);
            alert(`${isSignup ? "Account Created Successfully" : "Login Successful"}`);
        } catch (error) {
            setError("Invalid credentials or user already exists.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[100%] lg:w-[65%] border border-gray-300">
                {/* Logo */}
                <div className="flex justify-center mb-1">
                    <img src="/img/logo.jpg" alt="Automate Business" className="h-10" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                    {isSignup ? "Start Free Trial" : "Welcome To Automate Team"}
                </h2>

                {/* Google Login Button */}
                <div className="flex justify-center">
                    <button className="w-[100%] lg:w-[50%] flex items-center justify-center border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 transition">
                        <img src="/img/icons8-google-48.png" alt="Google" className="h-5 mr-2" />
                        <span className="text-gray-600 font-medium">
                            {isSignup ? "Sign Up" : "Continue"} with Google
                        </span>
                    </button>
                </div>

                <div className="text-center text-gray-500 my-3">or</div>

                {/* Display Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Login / Sign Up Form */}
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            {/* First Name & Last Name in Same Row (Only for Large Screens) */}
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="w-full lg:w-1/2 mb-3">
                                    <label className="text-gray-700 text-sm">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="w-full lg:w-1/2 mb-3">
                                    <label className="text-gray-700 text-sm">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email & WhatsApp Number in Same Row (Desktop) or Full Width (Mobile) */}
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="w-full lg:w-1/2 mb-3">
                                    <label className="text-gray-700 text-sm">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="w-full lg:w-1/2 mb-3 relative">
                                    <label className="text-gray-700 text-sm">WhatsApp Number</label>
                                    <div className="flex items-center border rounded mt-1">
                                        <span className="flex items-center bg-gray-200 py-2 px-5">
                                            +91
                                        </span>
                                        <input
                                            type="text"
                                            name="whatsappNumber"
                                            className="w-full p-2 focus:outline-none"
                                            placeholder="Enter WhatsApp number"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email (Only for Login) */}
                    {!isSignup && (
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {/* Password Input */}
                    <div className="mb-3 relative">
                        <label className="text-gray-700 text-sm">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirm Password (Only for Signup) */}
                    {isSignup && (
                        <div className="mb-3 relative">
                            <label className="text-gray-700 text-sm">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                        {isSignup ? "Create Account" : "Login"}
                    </button>
                </form>

                {/* ✅ Toggle Between Login & Signup */}
                <div className="text-center mt-4 text-sm text-gray-600">
                    {isSignup ? (
                        <>Already have an account? <button className="text-green-500 font-medium hover:underline" onClick={() => setIsSignup(false)}>Login here</button></>
                    ) : (
                        <>Don't have an account? <button className="text-green-500 font-medium hover:underline" onClick={() => setIsSignup(true)}>Sign Up</button></>
                    )}
                </div>
            </div>
        </div>
    );
}
