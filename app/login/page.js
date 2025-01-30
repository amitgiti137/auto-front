"use client";

import { useState } from "react";
import axios from "axios";

export default function AuthForm() {
    const [isLoginMode, setIsLoginMode] = useState(false); // Toggle between login and signup
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
    const [profile, setProfile] = useState(null); // Store the user profile details

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoginMode) {
                // Login logic
                const res = await axios.post('https://automate-business-backend.vercel.app/api/auth/login', { email, password });
                alert('Login successful!');
                // Fetch profile after login
                fetchProfile(email); // Pass email directly
                router.push('/task');
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
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
                </form>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <h2>Profile Details</h2>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <button onClick={() => setProfile(null)}>Logout</button>
                </div>
            )}
            {!profile && (
                <button onClick={() => setIsLoginMode(!isLoginMode)}>
                    Switch to {isLoginMode ? 'Signup' : 'Login'}
                </button>
            )}
        </div>
    );
}
