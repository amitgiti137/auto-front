"use client";

import React, { useEffect, useState } from "react";

const MyTask = () => {
    const [vendorId, setVendorId] = useState(null);
    const [employeeId, setEmployeeId] = useState(null);
    const [role, setRole] = useState(null);
    // State for selected period and status
    const [selectedPeriod, setSelectedPeriod] = useState("Today");
    const [selectedStatus, setSelectedStatus] = useState("Pending");

    // State for tasks fetched from API
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]); // ✅ Store employee list
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAssignedByMe, setShowAssignedByMe] = useState(false); 

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "",
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);




    // ✅ Read `localStorage` inside `useEffect` to avoid SSR issues
    useEffect(() => {
        if (typeof window !== "undefined") {
            setVendorId(localStorage.getItem("vendorId"));
            setEmployeeId(localStorage.getItem("employeeId"));
            setRole(localStorage.getItem("role"));
        }
    }, []);

    // List of periods
    const periods = ["Today", "Yesterday", "This Week", "This Month", "Last Month", "Next Week", "Next Month", "All Time", "Custom"];

    // List of statuses
    const statuses = ["Pending", "In-Progress", "Completed"];


    // ✅ Fetch Employees on Component Mount
    useEffect(() => {
        if (!vendorId) return;

        const fetchEmployees = async () => {
            try {
                const res = await fetch(`https://automate-ptg5.onrender.com/api/create/employees?vendorId=${vendorId}`);
                const data = await res.json();
                if (res.ok) {
                    setEmployees(data.employees || []);
                } else {
                    throw new Error(data.message || "Failed to fetch employees.");
                }
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        };

        fetchEmployees();
    }, [vendorId]);

    // ✅ Fetch Tasks when Component Mounts or when Period Changes
    useEffect(() => {
        if (!vendorId || !employeeId) {
            setError("Vendor ID or Employee ID is missing.");
            return;
        }

        if (selectedPeriod) {
            fetchTasks();
        }
    }, [vendorId, employeeId, selectedPeriod, showAssignedByMe]); // Fetch tasks when period changes

    // ✅ Fetch Tasks from API
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = showAssignedByMe
                ? `https://automate-ptg5.onrender.com/api/taskall/assigned-by/${vendorId}/${employeeId}`
                : `https://automate-ptg5.onrender.com/api/taskall/assigned-to/${vendorId}/${employeeId}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch tasks.");

            const data = await response.json();
            setTasks(data.tasks || []); // Store fetched tasks in state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Filter Tasks Based on Selected Status
    const filteredTasks = tasks.filter(task => task.status === selectedStatus);

    // ✅ Handle Edit Task Click
    const handleEditClick = (task) => {

        let formattedDate = "";

        if (task.dueDate) {
            try {
                // ✅ Convert "21/02/2025, 22:14" -> "2025-02-21"
                const [datePart] = task.dueDate.split(","); // Remove time part
                const [day, month, year] = datePart.trim().split("/"); // Split DD/MM/YYYY
                formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD format
            } catch (error) {
                console.error("Error parsing dueDate:", error);
            }
        }

        // ✅ Extract assigned user IDs
        const assignedUserIds = Array.isArray(task.assignedTo)
            ? task.assignedTo.map(emp => emp.employeeId)
            : [];

        setSelectedTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            dueDate: formattedDate,
            priority: task.priority,
            status: task.status,
        });
        setSelectedUsers(assignedUserIds); // ✅ Auto-select assigned team members
        setIsEditModalOpen(true);
    };

    // ✅ Handle Form Change
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Team Selection Change
    const handleUserSelection = (employeeId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(employeeId)
                ? prevSelected.filter(id => id !== employeeId)
                : [...prevSelected, employeeId]
        );
    };

    const handleFileChange = (event) => {
        setSelectedFile([...event.target.files]);
    };

    // ✅ Handle Task Update (Submit Form)
    const handleTaskUpdate = async () => {
        try {

            // ✅ Ensure `assignedTo` is always an array and remove null values
            const updatedAssignedTo = selectedUsers.filter(userId => userId !== null && userId !== undefined);

            // ✅ Convert updatePayload to FormData while keeping the same name
            const updatePayload = new FormData();
            updatePayload.append("role", role);
            updatePayload.append("title", formData.title);
            updatePayload.append("description", formData.description);
            updatePayload.append("priority", formData.priority);
            updatePayload.append("status", formData.status);

            updatedAssignedTo.forEach(userId => {
                updatePayload.append("assignedTo[]", userId); // Append array elements properly
            });

            if (role === "Admin") {
                updatePayload.append("dueDate", formData.dueDate);
            }

            // ✅ Append all selected files
            if (selectedFile && selectedFile.length > 0) {
                selectedFile.forEach(file => {
                    updatePayload.append("attachments", file); // Append multiple files
                });
            }



            const response = await fetch(
                `https://automate-ptg5.onrender.com/api/taskall/reassign/${vendorId}/${selectedTask.taskId}`,
                {
                    method: "PUT",
                    body: updatePayload,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Close modal and refresh tasks
            setIsEditModalOpen(false);
            fetchTasks();
        } catch (err) {
            alert(err.message);
        }
    };

    // ✅ Handle Task Deletion
    const handleDeleteTask = async (taskId) => {
        if (role !== "Admin") {
            alert("Only Admins can delete tasks.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await fetch(
                `https://automate-ptg5.onrender.com/api/trash/delete-task/${vendorId}/${taskId}/${role}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete task.");
            }

            alert(data.message || "Task deleted successfully!");
            fetchTasks(); // Refresh tasks after deletion
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            {/* Period Buttons */}
            <section className="my-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {periods.map((period, index) => (
                            <button
                                key={index}
                                className={`text-[12px] rounded-full px-3 py-1 transition ${selectedPeriod === period ? "bg-green-500 text-white font-bold" : "bg-gray-100"}`}
                                onClick={() => setSelectedPeriod(period)}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Status Filter Buttons */}
            {selectedPeriod && (
                <section className="my-5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-3">
                            {statuses.map((status, index) => (
                                <button
                                    key={index}
                                    className={`text-[12px] rounded-full px-3 py-1 transition ${selectedStatus === status ? "bg-blue-500 text-white font-bold" : "bg-gray-100"}`}
                                    onClick={() => setSelectedStatus(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Toggle Button for Task View */}
            <section className="text-center my-5">
                <button
                    className={`px-4 py-2 rounded-full text-white font-bold ${showAssignedByMe ? "bg-green-500" : "bg-blue-500"}`}
                    onClick={() => setShowAssignedByMe(!showAssignedByMe)}
                >
                    {showAssignedByMe ? "Show Assigned To Me" : "Show Assigned By Me"}
                </button>
            </section>

            {/* Task List */}
            <section className="flex justify-center items-center">
                <div className="lg:w-[60%] w-[100%] mt-4 p-4 border rounded shadow-md bg-white text-center">
                    <h2 className="text-lg font-bold">
                        {selectedPeriod ? `${selectedPeriod} - ${selectedStatus}` : "Select a Period"}
                    </h2>

                    {/* Loading & Error Handling */}
                    {loading && <p className="text-gray-500">Loading tasks...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Display tasks dynamically */}
                    <div className="mt-4">
                        {filteredTasks.length > 0 ? (
                            <ul className="list-disc list-inside text-left mx-auto w-[80%]">
                                {filteredTasks.map((task, index) => (
                                    <li key={index}
                                        className="flex justify-between items-center text-gray-700 py-2 border-b relative"
                                        onMouseEnter={() => setHoveredTask(task)} // ✅ Show pop-up on hover
                                        onMouseLeave={() => setHoveredTask(null)} // ✅ Hide pop-up on leave
                                    >
                                        {/* Task Title */}
                                        <span>{task.title} - <span className="text-sm text-gray-500">{task.dueDate}</span></span>

                                        {/* Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                                onClick={() => handleEditClick(task)}
                                            >
                                                ✏ Edit
                                            </button>

                                            {/* 🗑 Delete Button */}
                                            {role === "Admin" && (
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                                    onClick={() => handleDeleteTask(task.taskId)}
                                                >
                                                    🗑 Delete
                                                </button>
                                            )}
                                            {/* ➡ Chat Button */}
                                            <a href={`/chat?taskId=${task.taskId}`} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                                💬 Chat
                                            </a>
                                        </div>

                                        {/* Hover Pop-up */}
                                        {hoveredTask && hoveredTask.taskId === task.taskId && (
                                            <div className="absolute top-0 left-full ml-4 w-60 bg-white shadow-lg p-3 rounded-md border">
                                                <h3 className="text-md font-bold">{hoveredTask.title}</h3>
                                                <p className="text-sm text-gray-500">{hoveredTask.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">Priority: {hoveredTask.priority}</p>
                                                <p className="text-xs text-gray-400">Status: {hoveredTask.status}</p>
                                                <p className="text-xs text-gray-400">Due: {hoveredTask.dueDate}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tasks available.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Edit Task Modal */}
            {isEditModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsEditModalOpen(false)}>
                    <div className="relative bg-white p-6 rounded shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-3 text-gray-600 hover:text-red-500" onClick={() => setIsEditModalOpen(false)}>
                            ✖
                        </button>
                        <h2 className="text-lg font-bold">Edit Task</h2>

                        {/* Form Inputs */}
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded mt-2"
                            placeholder="Task Title"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded mt-2"
                            placeholder="Description"
                        ></textarea>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option>Pending</option>
                            <option>In-Progress</option>
                            <option>Completed</option>
                        </select>

                        {/* Assigned Users Selection - Dropdown Checkbox */}
                        <div className="mt-3 relative">
                            <p className="font-semibold">Select Team</p>

                            {/* Dropdown Button */}
                            <button
                                onClick={() => setIsUserListOpen(!isUserListOpen)}
                                className="w-full border p-2 rounded bg-gray-100 hover:bg-green-200 flex justify-between items-center"
                            >
                                {selectedUsers.length > 0
                                    ? `${selectedUsers.length} User(s) Selected`
                                    : "Select Team"}
                                <span>{isUserListOpen ? "▲" : "▼"}</span>
                            </button>

                            {/* Dropdown Checkbox List */}
                            {isUserListOpen && (
                                <div className="absolute w-full bg-white border rounded shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                                    {employees.map((emp) => (
                                        <label
                                            key={emp.employeeId}
                                            className="flex items-center gap-2 p-2 hover:bg-green-200 cursor-pointer"
                                        >
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


                        <input type="file" multiple className="w-full p-2 border rounded mt-2" onChange={handleFileChange} />

                        {/* Save Button */}
                        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={handleTaskUpdate}>
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyTask;
