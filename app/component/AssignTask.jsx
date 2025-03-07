"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"; 

const API_BASE_URL = "http://localhost:5000"; // API URL

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
    const [isUserListOpen, setIsUserListOpen] = useState(false);

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

    // ✅ Handle multiple file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files); // Convert to array
        if (!selectedFiles.length) return;

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        // ✅ Validate file types
        const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
        if (validFiles.length !== selectedFiles.length) {
            setError("Some files have invalid formats. Allowed: JPG, PNG, PDF, DOC, DOCX.");
            return;
        }

        setFiles(validFiles);
        setError("");
    };

    // Handle user selection
    const handleUserSelection = (employeeId) => {
        if (selectedUsers.includes(employeeId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== employeeId));
        } else {
            setSelectedUsers([...selectedUsers, employeeId]);
        }
    };

    // Remove a selected user
    const removeUser = (employeeId) => {
        setSelectedUsers(selectedUsers.filter((id) => id !== employeeId));
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
        const formData = new FormData();
        formData.append("title", taskTitle);
        formData.append("description", description);
        formData.append("priority", priority);
        formData.append("category", category);
        formData.append("dueDate", dueDate);
        formData.append("assignedBy", Number(user.employeeId));
        formData.append("vendorId", Number(vendorId));

        // ✅ Append selectedUsers (Array needs to be stringified)
        selectedUsers.forEach(userId => {
            formData.append("assignedTo", userId);
        });

        // ✅ Append multiple files
        files.forEach(file => {
            formData.append("attachments", file);
        });

        // ✅ Log formData for debugging
        console.log("FormData before sending:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }   

        try {
            const response = await fetch(`https://automate-ptg5.onrender.com/api/taskall/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const data = await response.json(); // ✅ First parse JSON response
            console.log("API Response:", response.data);

            if (!response.ok) throw new Error(data.error || "Failed to create task");

            setTaskTitle("");
            setDescription("");
            setSelectedUsers([]);
            setCategory("");
            setPriority("High");
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
            className="fixed overflow-y-auto inset-0 pt-auto bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white p-3 lg:p-6 rounded-lg shadow-lg w-[100%] lg:w-[60%] relative"
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
                <div className="mb-3 relative">
                    {/* <p className="font-semibold">Select Team</p> */}
                    <button
                        className="w-full border p-2 rounded bg-gray-100 hover:bg-green-200 flex justify-between items-center"
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                    >
                        {selectedUsers.length > 0
                            ? `${selectedUsers.length} User(s) Selected`
                            : "Select Team"}
                        {isUserListOpen ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
                    </button>

                    {isUserListOpen && (
                        <div className="absolute w-full bg-white border rounded shadow-lg mt-1 max-h-40 overflow-y-auto">
                            {employees.map((emp) => (
                                <label key={emp.employeeId} className="flex items-center gap-2 p-2 hover:bg-green-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(emp.employeeId)}
                                        onChange={() => handleUserSelection(emp.employeeId)}
                                    />
                                    {emp.firstName} {emp.lastName}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Display Selected Users */}
                {/* {selectedUsers.length > 0 && (
                    <div className="mb-3">
                        <p className="font-semibold">Assigned Users:</p>
                        <ul>
                            {selectedUsers.map((employeeId) => {
                                const user = employees.find((u) => u.employeeId === employeeId);
                                return (
                                    <li key={employeeId} className="flex justify-between items-center bg-gray-100 p-2 rounded my-1">
                                        {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
                                        <button className="text-red-500" onClick={() => removeUser(employeeId)}>
                                            <FaTrash />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )} */}

                {/* Select Category */}
                <select className="w-full hover:bg-green-100 border p-2 rounded mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                </select>

                {/* Priority Selection */}
                <div className="flex items-center gap-5 mb-3">
                <p className="font-semibold">Task Priority</p>
                    {["High", "Medium", "Low"].map((level) => (
                        <button
                            key={level}
                            className={`px-3 py-1 rounded ${priority === level ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-green-100"}`}
                            onClick={() => setPriority(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* Due Date */}
                <p className="font-semibold">Due Date</p>
                <input type="date" className="w-full border p-2 rounded mb-3" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

                {/* File Upload */}
                <input type="file" multiple className="w-full border p-2 rounded mb-3" onChange={handleFileChange} />
                {files.length > 0 && (
                    <p className="text-sm text-green-600 mb-2">{files.length} file(s) selected</p>
                )}

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
