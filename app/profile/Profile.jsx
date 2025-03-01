"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        email: "",
        department: "",
        designation: "",
        employeeCode: "",
        activeStatus: "",
        vendorId: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedEmail = localStorage.getItem("email");
            const storedVendorId = localStorage.getItem("vendorId");
    
            console.log("Stored Email:", storedEmail);
            console.log("Stored VendorId:", storedVendorId);
    
            if (storedEmail && storedVendorId) {
                fetchEmployeeDetails(storedEmail, storedVendorId);
            } else {
                console.error("Email or VendorId is missing from localStorage");
            }
        }
    }, []);
    

    // ✅ Fetch Employee Details
    const fetchEmployeeDetails = async (storedEmail, storedVendorId) => {
        setLoading(true);
        setError("");
    
        console.log("Fetching employee details with:", storedEmail, storedVendorId);
    
        try {
            const response = await fetch(
                `https://automate-ptg5.onrender.com/api/create/employee_details?email=${storedEmail}&vendorId=${storedVendorId}`,
                {
                    method: "GET",  // ✅ Explicitly define GET request
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("API Response:", data);
    
            // ✅ Ensure default values
            setFormData({
                firstName: data.user?.firstName || "",
                lastName: data.user?.lastName || "",
                whatsappNumber: data.user?.whatsappNumber || "",
                email: data.user?.email || "",
                department: data.user?.department || "",
                designation: data.user?.designation || "",
                employeeCode: data.user?.employeeCode || "",
                activeStatus: data.user?.activeStatus || "",
                vendorId: data.user?.vendorId || storedVendorId || "",
            });
        } catch (err) {
            console.error("Error fetching employee details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Form Submission (Update Employee)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("https://automate-ptg5.onrender.com/api/create/update_employee", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update employee details");
            }

            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="py-28 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[100%] lg:w-[65%] border border-gray-300">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">My Profile</h2>

                {/* Display Loading, Error, Success Messages */}
                {loading && <p className="text-blue-500 text-sm text-center">Loading profile...</p>}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                {/* Profile Form */}
                <form onSubmit={handleUpdate}>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                value={formData.lastName}
                                onChange={handleChange}
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
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                value={formData.designation}
                                onChange={handleChange}
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
                                value={formData.employeeCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">Status</label>
                            <input
                                type="text"
                                name="activeStatus"
                                className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={formData.activeStatus}
                                onChange={handleChange}
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
                                value={formData.email}
                                onChange={handleChange}
                                disabled // Email should not be editable
                            />
                        </div>

                        <div className="w-full lg:w-1/2 mb-3">
                            <label className="text-gray-700 text-sm">WhatsApp Number</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-green-400"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
