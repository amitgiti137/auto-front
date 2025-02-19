"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "https://automate-business-backend.vercel.app"; // API URL

export default function AssignTask({ isOpen, setIsOpen }) {
    const { user } = useAuth(); // Get logged-in user
    const router = useRouter();
    const [employees, setEmployees] = useState([]); // Store user list
    const [taskTitle, setTaskTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("high");
    const [dueDate, setDueDate] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch vendorId from localStorage/AuthContext on mount
    const [vendorId, setVendorId] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("vendorId") || "";
        }
        return "";
    });



    // Fetch employees based on vendorId


    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/create/employees?vendorId=${vendorId}`);
            if (res.data.status) {
                setEmployees(res.data.employees);
            } else {
                console.error("Error fetching employees:", res.data.message);
            }
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        }
    };

    // ✅ Redirect to login if vendorId is missing
    useEffect(() => {
        if (!vendorId) {
            router.push("/login"); // Redirect to login page
        } else {
            fetchEmployees();
        }
    }, [vendorId]);

    // Handle file selection
    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    // Handle user selection
    const handleUserSelection = (e) => {
        const selectedUser = e.target.value;
        if (selectedUser && !selectedUsers.includes(selectedUser)) {
            setSelectedUsers([...selectedUsers, selectedUser]);
        }
    };

    // Remove a selected user
    const removeUser = (employeeId) => {
        setSelectedUsers(selectedUsers.filter((user) => user !== employeeId));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!taskTitle || !description || selectedUsers.length === 0 || !category || !dueDate) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!vendorId) {
            setError("Vendor ID is missing. Please refresh and try again.");
            return;
        }

        /* if (selectedUsers.includes(user.employeeId)) {
            setError("You cannot assign a task to yourself.");
            return;
        } */

        setLoading(true);
        setError("");

        // ✅ Fix: Send JSON, not FormData
        const payload = {
            title: taskTitle,
            description,
            priority,
            category,
            dueDate,
            assignedBy: Number(user.employeeId), // ✅ Ensure assignedBy is a Number
            assignedTo: selectedUsers.map(user => Number(user)), // ✅ Ensure assignedTo is an array of Numbers
            vendorId: Number(vendorId), // ✅ Include vendor ID
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/taskall/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload), // ✅ Send JSON
            });

            const data = await response.json();
            console.log("API Response:", data); // ✅ Debugging Step

            if (!response.ok) throw new Error(data.error || "Failed to create task");

            setTaskTitle("");
            setDescription("");
            setSelectedUsers([]);
            setCategory("");
            setPriority("high");
            setDueDate("");
            setFiles([]);
            setIsOpen(false); // Close popup after successful creation

        } catch (error) {
            console.error("Error in creating task:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };



    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-[60%] relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={() => setIsOpen(false)}>
                    ✖
                </button>

                <h2 className="text-lg font-semibold mb-4">Assign New Task</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Task Title */}
                <input
                    type="text"
                    placeholder="Task Title"
                    className="w-full border p-2 rounded mb-3"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />

                {/* Task Description */}
                <textarea
                    placeholder="Short description of the task..."
                    className="w-full border p-2 rounded mb-3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Select Users */}
                <select className="w-full border p-2 rounded mb-3" onChange={handleUserSelection}>
                    <option value="">Select Users</option>
                    {employees.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                            {emp.firstName} {emp.lastName}
                        </option>
                    ))}
                </select>

                {/* Display Selected Users */}
                {selectedUsers.length > 0 && (
                    <div className="mb-3">
                        <p className="font-semibold">Assigned Users:</p>
                        <ul>
                            {selectedUsers.map((employeeId, index) => {
                                const user = employees.find((u) => u.employeeId === Number(employeeId));
                                return (
                                    <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded my-1">
                                        {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
                                        <button className="text-red-500" onClick={() => removeUser(employeeId)}>Remove</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Select Category */}
                <select className="w-full border p-2 rounded mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                </select>

                {/* Priority Selection */}
                <div className="flex gap-2 mb-3">
                    {["high", "medium", "low"].map((level) => (
                        <button
                            key={level}
                            className={`px-3 py-1 rounded ${priority === level ? "bg-green-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setPriority(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* Due Date */}
                <input type="date" className="w-full border p-2 rounded mb-3" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

                {/* File Upload */}
                <input type="file" multiple className="w-full border p-2 rounded mb-3" onChange={handleFileChange} />

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsOpen(false)}>Cancel</button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Assign Task"}
                    </button>
                </div>
            </div>
        </div>
    );
}
