"use client";

import React, { useEffect, useState } from "react";

const TaskDashboard = () => {
    const [vendorId, setVendorId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedVendorId = localStorage.getItem("vendorId");
            setVendorId(storedVendorId);
        }
    }, []);

    useEffect(() => {
        if (vendorId) {
            fetchTasks();
        }
    }, [vendorId, selectedPeriod]);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://automate-ptg5.onrender.com/api/taskall/vendor/${vendorId}?period=${selectedPeriod}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tasks.");
            }

            const data = await response.json();
            setTasks(data.tasks || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Group tasks by assigned employee names
    const groupedTasks = tasks.reduce((acc, task) => {
        task.assignedToNames.forEach((name) => {
            if (!acc[name]) {
                acc[name] = {
                    total: 0,
                    /* overdue: 0, */
                    pending: 0,
                    inProgress: 0,
                    completed: 0,
                };
            }
            acc[name].total++;
            switch (task.status) {
                /* case "Overdue":
                    acc[name].overdue++;
                    break; */
                case "Pending":
                    acc[name].pending++;
                    break;
                case "In-Progress":
                    acc[name].inProgress++;
                    break;
                case "Completed":
                    acc[name].completed++;
                    break;
                default:
                    break;
            }
        });
        return acc;
    }, {});

    // Calculate total summary values
    const summary = {
        total: tasks.length,
        /* overdue: tasks.filter((task) => task.status === "Overdue").length, */
        pending: tasks.filter((task) => task.status === "Pending").length,
        inProgress: tasks.filter((task) => task.status === "In-Progress").length,
        completed: tasks.filter((task) => task.status === "Completed").length,
    };

    return (
        <>
            {/* Period Selection Buttons */}
            <section className="my-10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                    {["Today", "Yesterday", "This Week", "This Month", "Last Month", "Next Week", "Next Month", "All Time", "Custom"].map((period, index) => (
                        <button
                            key={index}
                            className={`text-[12px] rounded-full px-3 py-1 transition ${
                                selectedPeriod === period ? "bg-green-500 text-white font-bold" : "bg-gray-200"
                            }`}
                            onClick={() => setSelectedPeriod(period)}
                        >
                            {period}
                        </button>
                    ))}
                    </div>
                </div>
            </section>

            {/* Task Summary */}
            <section className="container lg:max-w-[60%] mx-auto my-5">
                <div className="flex flex-wrap lg:flex-nowrap gap-1 justify-center text-center">
                    <div className="w-[48%] lg:w-[25%] py-1 px-3 bg-gray-100 rounded-md">
                        <p className="text-sm font-bold">Total Tasks</p>
                        <p className="text-sm font-semibold">{summary.total}</p>
                    </div>
                    {/* <div className="w-[48%] lg:w-[25%] py-1 px-3 bg-red-100 rounded-md">
                        <p className="text-sm font-bold text-red-500">Overdue</p>
                        <p className="text-sm font-semibold text-red-500">{summary.overdue}</p>
                    </div> */}
                    <div className="w-[48%] lg:w-[25%] py-1 px-3 bg-yellow-100 rounded-md">
                        <p className="text-sm font-bold text-yellow-500">Pending</p>
                        <p className="text-sm font-semibold text-yellow-500">{summary.pending}</p>
                    </div>
                    <div className="w-[48%] lg:w-[25%] py-1 px-3 bg-blue-100 rounded-md">
                        <p className="text-sm font-bold text-blue-500">In Progress</p>
                        <p className="text-sm font-semibold text-blue-500">{summary.inProgress}</p>
                    </div>
                    <div className="w-[48%] lg:w-[25%] py-1 px-3 bg-green-100 rounded-md">
                        <p className="text-sm font-bold text-green-500">Completed</p>
                        <p className="text-sm font-semibold text-green-500">{summary.completed}</p>
                    </div>
                </div>
            </section>

            {loading && <p className="text-gray-500 text-center">Loading tasks...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Task List Table */}
            <section className="container lg:max-w-[60%] mx-auto px-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border">Employee Name</th>
                                <th className="px-4 py-2 border">Total</th>
                                {/* <th className="px-4 py-2 border">Overdue</th> */}
                                <th className="px-4 py-2 border">Pending</th>
                                <th className="px-4 py-2 border">In Progress</th>
                                <th className="px-4 py-2 border">Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedTasks).length > 0 ? (
                                Object.entries(groupedTasks).map(([name, stats]) => (
                                    <tr key={name} className="text-center border-t">
                                        <td className="px-4 py-2 border">{name}</td>
                                        <td className="px-4 py-2 border">{stats.total}</td>
                                        {/* <td className="px-4 py-2 border text-red-500">{stats.overdue}</td> */}
                                        <td className="px-4 py-2 border text-yellow-500">{stats.pending}</td>
                                        <td className="px-4 py-2 border text-blue-500">{stats.inProgress}</td>
                                        <td className="px-4 py-2 border text-green-500">{stats.completed}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                        No tasks available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default TaskDashboard;
