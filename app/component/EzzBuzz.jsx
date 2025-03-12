"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://automate-ptg5.onrender.com"; // Change this to your backend URL

export default function Subscription() {
    const [adminDetails, setAdminDetails] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // ✅ Fetch Vendor ID from Local Storage
    useEffect(() => {
        const vendorId = localStorage.getItem("vendorId");

        if (!vendorId) {
            setError("Vendor ID missing. Please log in.");
            return;
        }

        // ✅ Fetch Admin Details for Prefill
        axios.get(`${API_BASE_URL}/api/admin/details?vendorId=${vendorId}`)
            .then(response => {
                setAdminDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching admin details:", error);
                setError("Failed to load user details.");
            });

        // ✅ Fetch Current Subscription Status
        axios.get(`${API_BASE_URL}/api/admin/subscription_status?vendorId=${vendorId}`)
            .then(response => {
                setSubscriptionStatus(response.data.status);
            })
            .catch(error => {
                console.error("Error fetching subscription status:", error);
                setError("Failed to fetch subscription status.");
            });

    }, []);

    // ✅ Handle Subscription Payment
    const handleSubscription = async (subscriptionType) => {
        setLoading(true);
        setError("");

        try {
            const vendorId = localStorage.getItem("vendorId");
            const response = await axios.post(`${API_BASE_URL}/api/ezzbuzz/create_payment_link`, {
                vendorId,
                subscriptionType
            });

            if (response.data.payment_url) {
                window.location.href = response.data.payment_url; // ✅ Redirect to EzzBuzz Checkout
            } else {
                setError("Failed to generate payment link.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setError("Payment processing failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Choose Your Subscription Plan</h1>

            {error && <p className="text-red-500">{error}</p>}

            {/* ✅ Show current subscription status */}
            {subscriptionStatus && (
                <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                    Current Subscription: <strong>{subscriptionStatus}</strong>
                </div>
            )}

            <div className="flex gap-6">
                {/* Trial Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md w-72 text-center">
                    <h2 className="text-xl font-semibold mb-2">1-Month Trial</h2>
                    <p className="text-gray-600">Get started with all features</p>
                    <p className="text-green-600 font-bold text-2xl mt-2">₹1</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                        onClick={() => handleSubscription("trial")}
                        disabled={loading || subscriptionStatus === "Active"}
                    >
                        {loading ? "Processing..." : "Start Trial"}
                    </button>
                </div>

                {/* 6-Month Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md w-72 text-center">
                    <h2 className="text-xl font-semibold mb-2">6-Month Subscription</h2>
                    <p className="text-gray-600">Enjoy premium access for 6 months</p>
                    <p className="text-green-600 font-bold text-2xl mt-2">₹2</p>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
                        onClick={() => handleSubscription("six_months")}
                        disabled={loading || subscriptionStatus === "Active"}
                    >
                        {loading ? "Processing..." : "Subscribe Now"}
                    </button>
                </div>
            </div>

            {/* ✅ Prefill Info Display */}
            {adminDetails && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
                    <h3 className="font-semibold">Your Details</h3>
                    <p>Name: {adminDetails.name}</p>
                    <p>Email: {adminDetails.email}</p>
                    <p>Mobile: {adminDetails.mobile}</p>
                </div>
            )}

            {/* ✅ Success Message for Subscription */}
            {subscriptionStatus === "Active" && (
                <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    🎉 Your subscription is active! Enjoy premium access.
                </div>
            )}
        </div>
    );
}
