"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiLogOut, FiSettings, FiUser, FiMoon, FiSun } from "react-icons/fi";
import { FaAndroid, FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context

export default function Header() {
    const { user, logout } = useAuth(); // ✅ Get user and logout function
    const [showDropdown, setShowDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    // ✅ Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <div className="inset-0 w-full bg-[#c2b5b5] dark:bg-gray-900 px-6 py-3 shadow-md flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex items-center mx-auto lg:ps-[110px]">
                <img src="/img/logo.jpg" alt="Logo" className="h-12" />
                <div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-3">I <span className="text-blue-500">A</span><span className="text-green-500">M</span> IT Planet</h1>
                <p className="text-[12px] px-3">Integrated <span className="text-blue-500">Auto</span><span className="text-green-500">mate</span> Information Transfer</p>
                </div>
            </div>

            {/* Right: User Info & Notifications */}
            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <FiBell className="text-gray-700 dark:text-white text-xl cursor-pointer" />

                {/* ✅ If User is Logged In */}
                {user ? (
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <span className="font-bold">
                                {user?.firstName?.charAt(0) || "U"}
                                {user?.lastName?.charAt(0) || ""}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
                                {/* User Info */}
                                <div className="flex items-center space-x-3 border-b pb-3">
                                    <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
                                        {user?.firstName?.charAt(0) || "U"}
                                        {user?.lastName?.charAt(0) || ""}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {user?.firstName || "User"} {user?.lastName || ""}
                                        </p>
                                        <p className="text-gray-500 text-sm">{user?.email || "No Email"}</p>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="mt-3">
                                    <button className="flex items-center space-x-3 w-full py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded">
                                        <FiUser /> <span>My Profile</span>
                                    </button>
                                    <button className="flex items-center space-x-3 w-full py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded">
                                        <FiSettings /> <span>Settings</span>
                                    </button>
                                    <button className="flex items-center space-x-3 w-full py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded">
                                        ₹ <span>Billing</span>
                                    </button>

                                    {/* Light / Dark Mode Toggle */}
                                    <div className="flex items-center justify-between w-full px-3 py-2">
                                        <span className="text-gray-700 dark:text-white">Dark Mode</span>
                                        <button
                                            className="flex items-center justify-center w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"
                                            onClick={toggleDarkMode}
                                        >
                                            {darkMode ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-gray-800" />}
                                        </button>
                                    </div>

                                    {/* Mobile Apps */}
                                    <button className="flex items-center space-x-3 w-full py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded">
                                        <FaAndroid /> <span>Android App</span>
                                    </button>
                                    <button className="flex items-center space-x-3 w-full py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 rounded">
                                        <FaApple /> <span>iPhone App</span>
                                    </button>

                                    {/* Logout Button */}
                                    <button
                                        className="flex items-center space-x-3 w-full py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 px-3 rounded mt-2"
                                        onClick={logout}
                                    >
                                        <FiLogOut /> <span>Log out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // ✅ Show "Login" Button when User is Logged Out
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                        onClick={() => router.push("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}
