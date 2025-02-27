import { useSearchParams } from "next/navigation";  // ✅ Import useSearchParams
import { useState, useEffect } from "react";

const TaskChat = () => {
    const searchParams = useSearchParams();  // ✅ Get query parameters
    const taskId = searchParams.get("taskId");  // ✅ Extract taskId from URL

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setEmployeeId(localStorage.getItem("employeeId"));
            setEmployeeName(localStorage.getItem("employeeName"));
        }
    }, []);

    useEffect(() => {
        if (taskId) {
            fetchMessages();
        }
    }, [taskId]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`https://automate-ptg5.onrender.com/api/chat/${taskId}`);
            const data = await res.json();
            if (res.ok) {
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Error fetching chat messages:", err);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || !taskId || !employeeId) return;

        try {
            const res = await fetch("https://automate-ptg5.onrender.com/api/chat/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    taskId: taskId,  // Corrected taskId
                    senderId: employeeId,  // Taken from localStorage
                    message: message // User-input message
                }),
            });

            if (res.ok) {
                fetchMessages(); // Refresh chat after sending message
                setMessage(""); // Clear input
            } else {
                console.error("Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className="flex items-end flex-col h-[550px] p-5">
            {/* Task Details */}
            <div className="mb-5 w-[100%] lg:w-[25%] p-4 bg-white rounded shadow">
                <h2 className="text-lg font-bold">Task Chat (Task ID: {taskId || "N/A"})</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 w-[100%] lg:w-[25%] overflow-y-auto bg-white p-4 rounded shadow">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-2 p-2 rounded ${msg.senderId == employeeId ? "bg-blue-100 text-right" : "bg-gray-200"}`}>
                            <p className="text-sm font-semibold">{msg.senderName}</p>
                            <p className="text-sm">{msg.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No messages yet.</p>
                )}
            </div>

            {/* Chat Input */}
            <div className="mt-4 w-[100%] lg:w-[25%] flex gap-2">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default TaskChat;
