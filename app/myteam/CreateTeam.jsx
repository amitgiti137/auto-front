"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CreateTeamForm({ closeModal }) {
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
        vendorId: "", // ✅ Will be set from localStorage
        role: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // ✅ Fetch vendorId from localStorage on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedVendorId = localStorage.getItem("vendorId");
            const storedrole = localStorage.getItem("role");
            if (storedVendorId, storedrole) {
                setFormData(prev => ({ ...prev, vendorId: storedVendorId, role: storedrole }));
            }
        }
    }, []);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

        try {
            const response = await fetch("https://automate-business-backend.vercel.app/api/create/register_employee", {
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-[100%] lg:w-[65%] border border-gray-300">
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
