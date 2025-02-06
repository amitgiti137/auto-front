import React, { useState } from "react";

const AssignTask = ({ isOpen, setIsOpen }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);
  const [assignMore, setAssignMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!taskTitle || !description || selectedUsers.length === 0 || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", taskTitle);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("category", category);
    formData.append("dueDate", dueDate);
    selectedUsers.forEach(user => formData.append("users[]", user));
    files.forEach(file => formData.append("attachments", file));

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: formData, // Sending formData for file uploads
      });

      if (!response.ok) throw new Error("Failed to create task");

      setTaskTitle("");
      setDescription("");
      setSelectedUsers([]);
      setCategory("");
      setPriority("High");
      setDueDate("");
      setFiles([]);
      setAssignMore(false);
      setIsOpen(false); // Close popup after successful creation

    } catch (error) {
      setError("Error creating task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setIsOpen(false)} // Clicking outside closes popup
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-[60%] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>

        <h2 className="text-lg font-semibold mb-4">Assign New Task</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Task Title"
          className="w-full border p-2 rounded mb-3"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <textarea
          placeholder="Short description of the task..."
          className="w-full border p-2 rounded mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Select Users */}
        <select
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setSelectedUsers([...selectedUsers, e.target.value])}
        >
          <option value="">Select Users</option>
          <option value="User1">User 1</option>
          <option value="User2">User 2</option>
        </select>

        {/* Select Category */}
        <select
          className="w-full border p-2 rounded mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
        </select>

        {/* Priority Selection */}
        <div className="flex gap-2 mb-3">
          {["High", "Medium", "Low"].map(level => (
            <button
              key={level}
              className={`px-3 py-1 rounded ${
                priority === level ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setPriority(level)}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Due Date */}
        <input
          type="date"
          className="w-full border p-2 rounded mb-3"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* File Upload */}
        <input
          type="file"
          multiple
          className="w-full border p-2 rounded mb-3"
          onChange={handleFileChange}
        />

        {/* Assign More Toggle */}
        <div className="flex justify-between items-center mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={assignMore}
              onChange={(e) => setAssignMore(e.target.checked)}
              className="mr-2"
            />
            Assign More Tasks
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
