"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function AuthForm() {
    const [isLoginMode, setIsLoginMode] = useState(false); // Toggle between login and signup
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
    const [profile, setProfile] = useState(null); // Store the user profile details
    const router = useRouter(); // Hook to handle redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoginMode) {
                // Login logic
                const res = await axios.post('https://automate-business-backend.vercel.app/api/auth/login', { email, password });
                alert('Login successful!');
                // Fetch profile after login
                fetchProfile(email); // Pass email directly
            } else {
                // Signup logic
                await axios.post('https://automate-business-backend.vercel.app/api/auth/register', {
                    name,
                    email,
                    password,
                    phoneNumber,
                });
                alert('Registration successful! Please log in.');
                setIsLoginMode(true); // Switch to login mode after successful registration
            }
        } catch (err) {
            alert(err.response?.data?.error || (isLoginMode ? 'Login failed.' : 'Registration failed.'));
        }
    };

    const fetchProfile = async (userEmail) => {
        try {
            const res = await axios.get(`https://automate-business-backend.vercel.app/api/auth/user_details?email=${userEmail}`);
            setProfile(res.data.data); // Save profile data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to fetch profile.');
        }
    };

    return (
        <div>
            {!profile ? (
                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <div className="my-5">
                            <input
                                className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                                type="tel"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    )}
                    <div>
                        <div className="my-5">
                            <input
                                className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="px-5 py-2 mx-5 rounded-md bg-slate-200"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="px-5 py-2 my-5 mx-5 rounded-md bg-slate-200" type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
                    </div>
                </form>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <h2>Profile Details</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <div className="flex gap-5">
                        <button className="px-5 py-2 mx-5 rounded-md bg-slate-200" onClick={() => setProfile(null)}>Logout</button>
                        <button className="px-5 py-2 mx-5 rounded-md bg-slate-300" onClick={() => router.push('/task')}>Task</button>
                    </div>
                </div>
            )}
            {!profile && (
                <button className="px-5 py-2 mx-5 rounded-md bg-slate-200" onClick={() => setIsLoginMode(!isLoginMode)}>
                    Switch to {isLoginMode ? 'Signup' : 'Login'}
                </button>
            )}
        </div>
    );
}
