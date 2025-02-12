"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://automate-business-backend.vercel.app"; // Replace with your deployed URL if needed

export default function AssignTask() {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [filteredUserId, setFilteredUserId] = useState(""); // For filtering tasks by user
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedBy, setAssignedBy] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [taskToReassign, setTaskToReassign] = useState("");
    const [newAssignedTo, setNewAssignedTo] = useState("");

    // Fetch employees and tasks on component mount
    useEffect(() => {
        fetchEmployees();
        fetchTasks();
    }, []);

    // Fetch employees from the API
    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/auth/users`);
            setEmployees(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        }
    };

    // Fetch all tasks or tasks for a specific user
    const fetchTasks = async (userId = "") => {
        try {
            const endpoint = userId
                ? `${API_BASE_URL}/api/tasks/${userId}`
                : `${API_BASE_URL}/api/tasks/`;
            const res = await axios.get(endpoint);
            setTasks(res.data || []);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    };

    // Create a new task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title || !description || !assignedBy || !assignedTo) {
            alert("All fields are required.");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/tasks/`, {
                title,
                description,
                assignedBy: Number(assignedBy), // Ensure it's a number
                assignedTo: [Number(assignedTo)], // Ensure array of numbers
            });
            alert(res.data.message);
            setTitle("");
            setDescription("");
            setAssignedBy("");
            setAssignedTo("");
            fetchTasks(); // Refresh tasks list
        } catch (err) {
            console.error("Failed to create task:", err);
            alert("Failed to create task.");
        }
    };

    // Reassign a task
    const handleReassignTask = async (e) => {
        e.preventDefault();
        if (!taskToReassign || !newAssignedTo) {
            alert("Please select a task and a new assignee.");
            return;
        }

        try {
            const res = await axios.put(`${API_BASE_URL}/api/tasks/reassign/${taskToReassign}`, {
                newAssignedTo: [Number(newAssignedTo)],  // ✅ Ensure userId is a number
            });
            alert(res.data.message);
            setTaskToReassign("");
            setNewAssignedTo("");
            fetchTasks(); // Refresh tasks list
        } catch (err) {
            console.error("Failed to reassign task:", err);
            alert("Failed to reassign task.");
        }
    };

    // Handle user filter change
    const handleUserFilterChange = (userId) => {
        setFilteredUserId(userId);
        if (userId) {
            fetchTasks(userId); // Fetch tasks for the selected user
        } else {
            fetchTasks(); // Fetch all tasks if no user is selected
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 className="px-5 py-2 mx-5">Task Management</h1>

            {/* Filter Tasks by User */}
            <h2 className="px-5 py-2 mx-5 mt-5">Filter Tasks</h2>
            <select
                className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                value={filteredUserId}
                onChange={(e) => handleUserFilterChange(e.target.value)}
                style={{ display: "block", marginBottom: "20px", width: "300px" }}
            >
                <option value="">All Users</option>
                {employees.map((emp) => (
                    <option key={emp.userId} value={emp.userId}>
                        {emp.firstName} {emp.lastName}
                    </option>
                ))}
            </select>

            {/* Create Task Section */}
            <h2 className="px-5 py-2 mx-5 mt-5">Create Task</h2>
            <form onSubmit={handleCreateTask}>
                <input
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                />
                <textarea
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px", height: "100px" }}
                ></textarea>
                <select
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    value={assignedBy}
                    onChange={(e) => setAssignedBy(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                >
                    <option value="">Assigned By</option>
                    {employees.map((emp) => (
                        <option key={emp.userId} value={emp.userId}>
                        {emp.firstName} {emp.lastName}
                    </option>
                    ))}
                </select>
                <select
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                >
                    <option value="">Assigned To</option>
                    {employees.map((emp) => (
                        <option key={emp.userId} value={emp.userId}>
                        {emp.firstName} {emp.lastName}
                    </option>
                    ))}
                </select>
                <button className="px-5 py-2 mx-5 rounded-md bg-slate-200" type="submit" style={{ padding: "10px 20px" }}>
                    Create Task
                </button>
            </form>

            {/* Reassign Task Section */}
            <h2 className="px-5 py-2 mx-5 mt-5">Reassign Task</h2>
            <form onSubmit={handleReassignTask}>
                <select
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    value={taskToReassign}
                    onChange={(e) => setTaskToReassign(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                >
                    <option value="">Select Task</option>
                    {tasks.map((task) => (
                        <option key={task._id} value={task._id}>
                            {task.title}
                        </option>
                    ))}
                </select>
                <select
                    className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                >
                    <option value="">New Assigned To</option>
                    {employees.map((emp) => (
                        <option key={emp.userId} value={emp.userId}>
                        {emp.firstName} {emp.lastName}
                    </option>
                    ))}
                </select>
                <button className="px-5 py-2 mx-5 rounded-md bg-slate-200" type="submit" style={{ padding: "10px 20px" }}>
                    Reassign Task
                </button>
            </form>

            {/* Task List */}
            <h2 className="px-5 py-2 mx-5 mt-5">Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li className="px-5 py-2 mx-5 rounded-md bg-slate-200" key={task._id} style={{ marginBottom: "10px" }}>
                    <strong>{task.title}</strong>: {task.description}
                    <br />
                    Assigned By: {task.assignedBy?.name || "Unknown"} |
                    Assigned To: {task.assignedTo.length > 0 
                        ? task.assignedTo.map(user => user.name).join(', ') 
                        : "Unknown"}
                </li>
                ))}
            </ul>
        </div>
    );
}
