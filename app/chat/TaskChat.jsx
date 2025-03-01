import Image from "next/image";
import { useSearchParams } from "next/navigation";  // ✅ Import useSearchParams
import { useState, useEffect } from "react";
import Link from "next/link";

const TaskChat = () => {
    const searchParams = useSearchParams();  // ✅ Get query parameters
    const taskId = searchParams.get("taskId");  // ✅ Extract taskId from URL

    const [vendorId, setVendorId] = useState(null);
    const [taskDetails, setTaskDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setEmployeeId(localStorage.getItem("employeeId"));
            setEmployeeName(localStorage.getItem("employeeName"));
            setVendorId(localStorage.getItem("vendorId"));
        }
    }, []);

    useEffect(() => {
        if (taskId) {
            fetchMessages();
        }
    }, [taskId]);


    useEffect(() => {
        if (vendorId) {
            fetchTaskDetails();
            sendMessage();
        }
    }, [vendorId]);

    // ✅ Fetch Task Details
    const fetchTaskDetails = async () => {
        try {
            const res = await fetch(`https://automate-ptg5.onrender.com/api/taskall/task/${vendorId}/${taskId}`);
            const data = await res.json();
            if (res.ok) {
                setTaskDetails(data.task || null);
            }
        } catch (err) {
            console.error("Error fetching task details:", err);
        }
    };


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
                    vendorId: vendorId,
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
        <div className="lg:ms-[70px] mt-20 flex flex-wrap justify-between">
            {/* Left Side - Task Details */}
            <div className="lg:px-[100px] w-[100%] lg:w-[68%] p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-3">Task Details</h2>
                {taskDetails ? (
                    <div>
                        <p><strong>Title:</strong> {taskDetails.title}</p>
                        <p><strong>Description:</strong> {taskDetails.description}</p>
                        <p><strong>Category:</strong> {taskDetails.category}</p>
                        <p><strong>Priority:</strong> {taskDetails.priority}</p>
                        <p><strong>Due Date:</strong> {taskDetails.dueDate}</p>
                        <p><strong>Status:</strong> {taskDetails.status}</p>
                        <p><strong>Assigned By:</strong> {taskDetails.assignedByName}</p>
                        <p><strong>Assigned To:</strong> {taskDetails.assignedToNames.join(", ")}</p>

                        {/* Display Attachments if Available */}
                        {taskDetails.attachments && taskDetails.attachments.length > 0 ? (
                            <div className="mt-3">
                                <p><strong>Attachments:</strong></p>
                                <div className="flex flex-wrap gap-3">
                                    {taskDetails.attachments.map((attachment, index) => (
                                        <div key={index} className="border p-1 rounded shadow">
                                            <Link href={attachment.replace(/ /g, "%20")} target="_blank" rel="noopener noreferrer">
                                                {/\.(jpeg|jpg|png)$/i.test(attachment) ? ( // ✅ Check if it's an image
                                                    <Image
                                                        src={attachment.replace(/ /g, "%20")} // ✅ Encode spaces
                                                        alt={`Task Attachment ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                        style={{ width: "100%", height: "auto" }}
                                                        className="object-cover cursor-pointer" // ✅ Add pointer cursor
                                                        priority={true}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-blue-500 underline">
                                                        {attachment.split("/").pop()} {/* Show file name */}
                                                    </span>
                                                )}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-4">No attachments available</p>
                        )}

                    </div>
                ) : (
                    <p className="text-gray-500">Loading task details...</p>
                )}
            </div>

            <div className="flex flex-col w-[100%] lg:w-[30%] h-[550px]">
                {/* Task Details */}
                <div className="mb-5 w-[100%] p-4 bg-white rounded shadow">
                    <div className="flex gap-5 items-center">
                        <h2 className="text-lg font-bold">Task Chat</h2>
                        <h4>{taskId || "N/A"}</h4>
                        <h4>({taskDetails?.title})</h4>
                    </div>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 w-[100%] overflow-y-auto bg-white p-4 rounded shadow">
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
                <div className=" mt-4 w-[100%] flex gap-2">
                    <div className="w-[80%]">
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                    </div>
                    <div className="w-[20%]">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskChat;
