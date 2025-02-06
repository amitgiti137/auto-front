import React, { useState } from 'react';

const TaskAll = () => {
    // State for selected period and status
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("Overview");

    // List of periods
    const periods = ["Today", "Yesterday", "This Week", "This Month", "Last Month", "Next Week", "Next Month", "All Time", "Custom"];

    // List of statuses
    const statuses = ["Overview", "Pending", "In Progress", "Completed"];

    // Task Data (Object storing tasks for each period and status)
    const taskData = {
        "Today": {
            "Overview": ["Meeting with client", "Submit report", "Review project"],
            "Pending": ["Send emails", "Approve budget"],
            "In Progress": ["Fix website bugs"],
            "Completed": ["Morning stand-up", "Team sync-up"],
        },
        "Yesterday": {
            "Overview": ["Code review", "Write documentation"],
            "Pending": ["Schedule interviews"],
            "In Progress": ["Update UI design"],
            "Completed": ["Deploy feature X"],
        },
        "This Week": {
            "Overview": ["Plan weekly goals", "Check performance metrics"],
            "Pending": ["Client proposal approval"],
            "In Progress": ["Fix database errors"],
            "Completed": ["Team presentation"],
        },
        "This Month": {
            "Overview": ["Quarterly business review", "Set new targets"],
            "Pending": ["HR feedback meeting"],
            "In Progress": ["Develop new feature"],
            "Completed": ["Employee training session"],
        },
        "Last Month": {
            "Overview": ["Finalize monthly reports", "Client check-in"],
            "Pending": ["Marketing campaign approval"],
            "In Progress": ["Refactor codebase"],
            "Completed": ["Close deals"],
        },
        "Next Week": {
            "Overview": ["Prepare for sprint planning", "Strategy meeting"],
            "Pending": ["Confirm workshop schedule"],
            "In Progress": ["Work on bug fixes"],
            "Completed": ["Update documentation"],
        },
        "Next Month": {
            "Overview": ["Set Q2 goals", "Review product roadmap"],
            "Pending": ["Finalize hiring decisions"],
            "In Progress": ["Develop MVP feature"],
            "Completed": ["Budget allocation"],
        },
        "All Time": {
            "Overview": ["Company growth tracking", "Customer feedback"],
            "Pending": ["Legal documentation updates"],
            "In Progress": ["Implement AI automation"],
            "Completed": ["Website revamp"],
        },
        "Custom": {
            "Overview": ["Custom analytics", "Experiment with features"],
            "Pending": ["Gather requirements"],
            "In Progress": ["Work on UI improvements"],
            "Completed": ["Finalize branding"],
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
                                className={`text-[12px] rounded-full px-3 py-1 transition ${selectedPeriod === period ? "bg-green-500 text-white font-bold" : "bg-gray-100"
                                    }`}
                                onClick={() => setSelectedPeriod(period)}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Status Buttons (Shown only when a period is selected) */}
            {selectedPeriod && (
                <section className="my-5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-3">
                            {statuses.map((status, index) => (
                                <button
                                    key={index}
                                    className={`text-[12px] rounded-full px-3 py-1 transition ${selectedStatus === status ? "bg-blue-500 text-white font-bold" : "bg-gray-100"
                                        }`}
                                    onClick={() => setSelectedStatus(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Task List (Example - Replace with actual data) */}
            <section className="flex justify-center items-center">
                <div className="lg:w-[60%] mt-4 p-4 border rounded shadow-md bg-white text-center">
                    <h2 className="text-lg font-bold">
                        {selectedPeriod ? `${selectedPeriod} - ${selectedStatus}` : "Select a Period"}
                    </h2>
                    <div className="mt-4">
                        {/* Display tasks dynamically */}
                        {selectedPeriod && selectedStatus && taskData[selectedPeriod][selectedStatus].length > 0 ? (
                            <ul className="list-disc list-inside text-left mx-auto w-[80%]">
                                {taskData[selectedPeriod][selectedStatus].map((task, index) => (
                                    <li key={index} className="text-gray-700">{task}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tasks available.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default TaskAll;
