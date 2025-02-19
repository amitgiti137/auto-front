"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CreateTeamForm from "./CreateTeam";

const API_BASE_URL = "https://automate-business-backend.vercel.app"; // API URL

export default function EmployeeList() {
    const { user } = useAuth(); // Get logged-in user
    const [employees, setEmployees] = useState([]); // Store employee list
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Manage modal state

    // ✅ Fetch vendorId from localStorage
    const vendorId = typeof window !== "undefined" ? localStorage.getItem("vendorId") || "" : "";

    // ✅ Fetch employees based on vendorId
    useEffect(() => {
        if (!vendorId) return;
        fetchEmployees();
    }, [vendorId]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/create/employees?vendorId=${vendorId}`);
            if (res.data.status) {
                setEmployees(res.data.employees);
            } else {
                setError("Error fetching employees.");
            }
        } catch (err) {
            setError("Failed to fetch employees.");
            console.error("Error fetching employees:", err);
        }
        setLoading(false);
    };

    // ✅ Close Modal Function
    const closeModal = () => {
        setIsModalOpen(false);
        fetchEmployees(); // Refresh employee list after closing modal
    };
     

    return (
        <div className="container mx-auto px-20 mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Employee List</h2>
                {/* ✅ Add Member Button to open Modal */}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Member
                </button>
            </div>

            {/* ✅ Display Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ Show Loading Indicator */}
            {loading ? (
                <p className="text-gray-500">Loading employees...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Employee ID</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Designation</th>
                                <th className="border border-gray-300 px-4 py-2">Employee Code</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ? (
                                employees.map((emp) => (
                                    <tr key={emp.employeeId} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{emp.employeeId}</td>
                                        <td className="border border-gray-300 px-4 py-2">{emp.firstName} {emp.lastName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{emp.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{emp.department}</td>
                                        <td className="border border-gray-300 px-4 py-2">{emp.designation}</td>
                                        <td className="border border-gray-300 px-4 py-2">{emp.employeeCode}</td>
                                        <td className={`border px-4 py-2 ${emp.activeStatus === "Active" ? "text-green-600" : "text-red-600"}`}>
                                            {emp.activeStatus}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">No employees found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ Modal for Adding Team Member */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal} // ✅ Clicking outside will close modal
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-[60%] relative"
                        onClick={(e) => e.stopPropagation()} // ✅ Prevent click inside from closing modal
                    >
                        {/* ✅ Close Button */}
                        {/* <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={closeModal}>
                            ✖
                        </button> */}

                        {/* ✅ Render CreateTeamForm */}
                        <CreateTeamForm closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}
