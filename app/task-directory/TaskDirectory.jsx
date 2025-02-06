import { useState } from "react";

const TaskDirectory = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // List of categories for filtering
    const categories = [
        "IT", "Manufacturing", "Trading", "Service Provider", "Logistics",
        "Travel/Tourism", "Construction", "E-commerce", "Education/EdTech",
        "Health and Wellness", "Financial Services", "Hospitality"
    ];

    // Task Categories by Department
    const taskCategories = {
        "IT": [
            { name: "Software Development", templates: 20 },
            { name: "Cyber Security", templates: 15 },
            { name: "Networking", templates: 12 }
        ],
        "Manufacturing": [
            { name: "Product Design", templates: 18 },
            { name: "Quality Control", templates: 14 },
            { name: "Supply Chain", templates: 10 }
        ],
        "Trading": [
            { name: "Stock Analysis", templates: 16 },
            { name: "Risk Management", templates: 12 }
        ],
        "Service Provider": [
            { name: "Customer Support", templates: 25 },
            { name: "Maintenance Services", templates: 18 }
        ],
        "Logistics": [
            { name: "Fleet Management", templates: 14 },
            { name: "Warehousing", templates: 12 }
        ],
        "Travel/Tourism": [
            { name: "Tour Planning", templates: 20 },
            { name: "Customer Reservations", templates: 15 }
        ],
        "Construction": [
            { name: "Project Management", templates: 22 },
            { name: "Safety Regulations", templates: 18 }
        ],
        "E-commerce": [
            { name: "Online Store Management", templates: 24 },
            { name: "Product Listings", templates: 20 }
        ],
        "Education/EdTech": [
            { name: "Course Development", templates: 22 },
            { name: "Student Management", templates: 18 }
        ],
        "Health and Wellness": [
            { name: "Patient Care", templates: 30 },
            { name: "Wellness Programs", templates: 25 }
        ],
        "Financial Services": [
            { name: "Investment Strategies", templates: 18 },
            { name: "Accounting", templates: 12 }
        ],
        "Hospitality": [
            { name: "Hotel Management", templates: 20 },
            { name: "Guest Services", templates: 15 }
        ]
    };

    // Get tasks based on selected category
    const tasksToShow = selectedCategory ? taskCategories[selectedCategory] || [] : Object.values(taskCategories).flat();

    // Filter tasks based on search
    const filteredTasks = tasksToShow.filter(task =>
        task.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="flex justify-center my-10">
            <div className="my-10 w-[100%] lg:w-[65%] px-4">
                <h2 className="text-lg font-bold text-center mb-2">Tasks Directory</h2>
                <p className="text-center text-sm text-gray-600 mb-4">
                    List of Department-wise Tasks curated by Automate Business
                </p>

                {/* Search & Reset Section */}
                <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search Template"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border rounded-md w-[200px] lg:w-[250px] text-sm text-center"
                    />
                    <button
                        onClick={() => { setSearch(""); setSelectedCategory(""); }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-md text-sm"
                    >
                        Reset
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 justify-center mb-5">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 text-sm rounded-md transition 
                            ${selectedCategory === category ? "bg-green-500 text-white" : "bg-gray-100"}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Task List */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md w-[48%] sm:w-[30%] md:w-[23%] lg:w-[22%]">
                                <h3 className="text-md font-semibold">{task.name}</h3>
                                <p className="text-sm text-gray-600">{task.templates} Templates</p>
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

export default TaskDirectory;
