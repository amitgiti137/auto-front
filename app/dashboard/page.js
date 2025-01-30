"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://automate-business-backend.vercel.app/api/tasks/your-user-id', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data);
        };
        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {tasks.map((task) => (
                <div key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                </div>
            ))}
        </div>
    );
}
