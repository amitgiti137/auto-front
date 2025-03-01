import { useState } from "react";

const TaskTemplates = () => {
    const [search, setSearch] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [category, setCategory] = useState("");

    // Predefined Task Names
    const taskNames = [
        "Project Planning",
        "Marketing Strategy",
        "UI/UX Design",
        "Software Testing",
        "Content Writing"
    ];

    // Predefined Categories
    const categoriesList = ["Marketing", "Development", "Design", "Operations", "Finance"];

    // Predefined Created By List
    const createdByList = ["Me", "Team", "Admin"];

    // Task List
    const [tasks, setTasks] = useState([
        { name: "Production Meeting", category: "Marketing", createdBy: "Team" },
        { name: "Financial Analysis", category: "Finance", createdBy: "Me" },
        { name: "Product Launch", category: "Operations", createdBy: "Admin" }
    ]);

    // Selected New Task Index
    const [newTaskIndex, setNewTaskIndex] = useState(0);

    // Add New Task from Predefined List
    const addNewTask = () => {
        const newTask = {
            name: taskNames[newTaskIndex % taskNames.length],
            category: categoriesList[newTaskIndex % categoriesList.length],
            createdBy: createdByList[newTaskIndex % createdByList.length]
        };

        setTasks([...tasks, newTask]); // Append new task
        setNewTaskIndex(newTaskIndex + 1); // Move to the next name
    };

    // Reset filters
    const resetFilters = () => {
        setSearch("");
        setCreatedBy("");
        setCategory("");
    };

    // Filtered Tasks Logic
    const filteredTasks = tasks.filter((task) =>
        task.name.toLowerCase().includes(search.toLowerCase()) &&
        (category ? task.category === category : true) &&
        (createdBy ? task.createdBy === createdBy : true)
    );

    return (
        <section className="bg-[#F0F0D7] h-screen flex justify-center pt-28">
            <div className="w-[100%] lg:w-[60%] flex flex-col items-center text-center">
                <h2 className="text-lg font-bold mb-4">Task Templates</h2>

                {/* Search & Filter Section */}
                <div className="flex flex-wrap gap-3 justify-center items-center w-full">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search Here..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border rounded-md w-[200px] lg:w-[250px] text-sm text-center"
                    />

                    {/* Created By Dropdown */}
                    <select
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        className="px-3 py-2 border rounded-md w-[150px] lg:w-[180px] text-sm bg-white text-center"
                    >
                        <option value="">Created By</option>
                        {createdByList.map((creator, index) => (
                            <option key={index} value={creator}>{creator}</option>
                        ))}
                    </select>

                    {/* Category Dropdown */}
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md w-[150px] lg:w-[180px] text-sm bg-white text-center"
                    >
                        <option value="">Category</option>
                        {categoriesList.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-md text-sm"
                    >
                        Reset
                    </button>
                </div>

                {/* Add New Task Section */}
                <div className="flex flex-wrap gap-3 justify-center items-center mt-4">
                    <button
                        onClick={addNewTask}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        + Add New Task
                    </button>
                </div>

                {/* Task Templates List */}
                <div className="mt-5 w-full flex flex-wrap justify-center gap-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md w-[90%] sm:w-[45%] md:w-[30%] lg:w-[25%]">
                                <h3 className="text-md font-semibold">{task.name}</h3>
                                <p className="text-sm text-gray-600">{task.category} | {task.createdBy}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center w-full mt-4">No tasks found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TaskTemplates;
