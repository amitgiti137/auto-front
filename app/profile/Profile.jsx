"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        email: "",
        newEmail: "", // ✅ New email field
        otp: "", // ✅ OTP field
        department: "",
        designation: "",
        employeeCode: "",
        activeStatus: "",
        vendorId: "",
        oldPassword: "", // ✅ Previous password
        newPassword: "", // ✅ New password
        confirmPassword: "" // ✅ Confirm password
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

    // ✅ Send OTP for Email Update
    const sendOtp = async () => {
        if (!formData.newEmail) {
            alert("Please enter a new email before requesting OTP.");
            return;
        }

        try {
            const res = await fetch("https://automate-ptg5.onrender.com/api/create/send_otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.newEmail })
            });

            if (!res.ok) {
                throw new Error("Failed to send OTP. Try again.");
            }

            alert("OTP sent to your new email.");
        } catch (error) {
            alert(error.message);
        }
    };

    // ✅ Handle Form Submission (Update Employee)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {

            const payload = {
                email: formData.email,
                vendorId: formData.vendorId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                whatsappNumber: formData.whatsappNumber,
                department: formData.department,
                designation: formData.designation,
                employeeCode: formData.employeeCode,
                activeStatus: formData.activeStatus
            };

            // ✅ Add new email and OTP if updating email
            if (formData.newEmail) {
                payload.newEmail = formData.newEmail;
                payload.otp = formData.otp;
            }

            // ✅ Add password change fields if updating password
            if (formData.newPassword && formData.oldPassword) {
                payload.oldPassword = formData.oldPassword;
                payload.password = formData.newPassword;
            }

            const response = await fetch("https://automate-ptg5.onrender.com/api/create/update_employee", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update employee details");
            }

            setSuccess("Profile updated successfully!");
            // ✅ Update email in localStorage if changed
            if (formData.newEmail) {
                localStorage.setItem("email", formData.newEmail);
                setFormData({ ...formData, email: formData.newEmail, newEmail: "", otp: "" });
            }
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
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 mb-3">
                            {/* Email Update Section */}
                            <label className="text-gray-700 text-sm">Update Email</label>
                            <input type="email" name="newEmail" className="border p-2 rounded w-full mt-2" value={formData.newEmail || ""} onChange={handleChange} placeholder="Enter New Email" />
                        </div>
                        <div className="w-full lg:w-1/2">
                            {/* OTP Input */}
                            <div className="flex mt-7">
                                <input type="text" name="otp" className="border px-2 rounded w-full" value={formData.otp || ""} onChange={handleChange} placeholder="Enter OTP" />
                                <button type="button" className="bg-blue-500 text-white px-4 rounded ml-2" onClick={sendOtp}>Send OTP</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full">
                            {/* Password Update Section */}
                        <label className="text-gray-700 text-sm">Update Password</label>
                        <div className="flex w-full gap-4 mb-3">
                        <input type="password" name="oldPassword" className="border p-2 rounded w-full mt-2" value={formData.oldPassword || ""} onChange={handleChange} placeholder="Current Password" />
                        <input type="password" name="newPassword" className="border p-2 rounded w-full mt-2" value={formData.newPassword || ""} onChange={handleChange} placeholder="New Password" />
                        <input type="password" name="confirmPassword" className="border p-2 rounded w-full mt-2" value={formData.confirmPassword || ""} onChange={handleChange} placeholder="Confirm New Password" />
                        </div>
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
