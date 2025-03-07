"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

const API_BASE_URL = "https://automate-ptg5.onrender.com";

export default function CreateTeamForm({ closeModal }) {

    const userEmail = typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";
    const vendorId = typeof window !== "undefined" ? localStorage.getItem("vendorId") || "" : "";
    const employeeId = typeof window !== "undefined" ? localStorage.getItem("employeeId") || "" : "";

    
    const [userRole, setUserRole] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        designation: "",
        employeeCode: "",
        activeStatus: "",
        vendorId: vendorId || "", // ✅ Will be set from localStorage
        role: "",
        otp: "",
    });

    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    
    const sendOtp = async (e) => {
        e.preventDefault(); // Prevent form submission

        if (!formData.email) {
            alert("Please enter your email before requesting OTP.");
            return;
        }

        try {
            const res = await axios.post(`https://automate-business-backend.vercel.app/api/create/send_otp`, {
                email: formData.email
            });

            if (res.status === 200) {
                alert("OTP sent to your email address");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Please try again.");
        }
    };
    

    useEffect(() => {
        if (!vendorId || !userEmail) return; // ✅ Prevents early execution

        fetchUserRole();
    }, [vendorId, userEmail]);

    useEffect(() => {
        if (userRole) { // ✅ Ensure userRole exists before updating
            setFormData((prevFormData) => ({
                ...prevFormData,
                role: userRole || "" // ✅ Ensure it's always a string
            }));
        }
    }, [userRole]);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value || "", });
    };

    const fetchUserRole = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/create/employee_details`, {
                params: { email: userEmail, vendorId },
            });
            if (res.data.status) {
                setUserRole(res.data.user.role); // ✅ Store role securely
            } else {
                console.error("Failed to fetch role.");
            }
        } catch (err) {
            console.error("Error fetching role:", err);
        }
    }

    // ✅ Handle Signup Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!formData.vendorId) {
            setError("Vendor ID is missing. Please refresh and try again.");
            return;
        }
        console.log(vendorId);

        try {
            const response = await fetch("https://automate-ptg5.onrender.com/api/create/register_employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to register employee");
            }

            // ✅ Show success message
            setSuccess("Team Member Registered Successfully!");

            setTimeout(() => {
                closeModal(); // ✅ Close the modal
            }, 1000);

            // ✅ Reset form after successful signup
            setFormData({
                firstName: "",
                lastName: "",
                whatsappNumber: "",
                email: "",
                password: "",
                confirmPassword: "",
                department: "",
                designation: "",
                employeeCode: "",
                activeStatus: "",
                vendorId: localStorage.getItem("vendorId") || "" // Keep vendorId intact
            });

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen pt-1 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[100%]  border border-gray-300 relative">
                {/* Logo */}
                <div className="flex justify-center mb-1">
                    <img src="/img/logo.jpg" alt="Automate Business" className="h-10" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2c">
                    Register a New Team Member
                </h2>

                {/* ✅ Close Button */}
                <button className="absolute top-6 right-10 text-gray-600 hover:text-red-500" onClick={closeModal}>
                    ✖
                </button>

                {/* Display Error / Success Messages */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
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
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                placeholder="Enter department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                placeholder="Enter designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Employee Code</label>
                            <input
                                type="text"
                                name="employeeCode"
                                className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Enter first name"
                                value={formData.employeeCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Status</label>
                            <input
                                type="text"
                                name="activeStatus"
                                className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Enter last name"
                                value={formData.activeStatus}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">WhatsApp Number</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                placeholder="Enter WhatsApp number"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3 relative">
                                    <label className="text-gray-700 text-sm">OTP</label>
                                    <div className="flex items-center border rounded mt-1">
                                        <input
                                            type="text"
                                            name="otp"
                                            className="w-full p-2 focus:outline-none"
                                            placeholder="Enter OTP"
                                            value={formData.otp || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button" // Prevent form submission
                                    className="w-full lg:w-1/2 mt-7 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                                    onClick={sendOtp} // ✅ Call sendOtp function
                                >
                                    Send OTP
                                </button>
                    </div>

                    {/* Password Fields */}
                    <div className="mb-3">
                        <label className="text-gray-700 text-sm">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="text-gray-700 text-sm">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-[#71BBB2] text-white py-2 rounded-md hover:bg-[#EFE9D5] hover:text-[#71BBB2] transition">
                        Register Employee
                    </button>
                </form>
            </div>
        </div>
    );
}
