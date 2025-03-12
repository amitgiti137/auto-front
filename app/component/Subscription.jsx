"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://automate-ptg5.onrender.com";

export default function SubscriptionPage() {
    const [vendorId, setVendorId] = useState(null);
    const [adminDetails, setAdminDetails] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedVendorId = localStorage.getItem("vendorId");
        if (storedVendorId) {
            setVendorId(storedVendorId);
            fetchAdminDetails(storedVendorId);
        } else {
            setError("Vendor ID is missing. Please login again.");
        }
    }, []);

    const fetchAdminDetails = async (vendorId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/details?vendorId=${vendorId}`);
            setAdminDetails(response.data);
        } catch (error) {
            setError("Failed to fetch admin details.");
        }
    };

    const handleSubscription = async (planType) => {
        setLoading(true);
        setError("");
        

        try {
            const orderResponse = await axios.post(`${API_BASE_URL}/api/paysubs/create_order`, {
                vendorId,
                plan: planType,
            });

            const { orderId, amount } = orderResponse.data;

            const options = {
                key: "YOUR_RAZORPAY_KEY_ID",
                amount: amount * 100,
                currency: "INR",
                name: "Automate Business",
                description: "Subscription Payment",
                order_id: orderId,
                prefill: {
                    name: adminDetails.name || "User",
                    email: adminDetails.email || "user@example.com",
                    contact: adminDetails.mobile || "9999999999",
                },
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(`${API_BASE_URL}/api/paysubs/verify_payment`, {
                            vendorId,
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            plan: planType,
                        });

                        alert(verifyResponse.data.message);
                    } catch (error) {
                        setError("Payment verification failed.");
                    }
                },
                theme: { color: "#4CAF50" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            setError("Subscription process failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Choose Your Subscription Plan</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex gap-6">
                {/* Trial Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md w-72 text-center">
                    <h2 className="text-xl font-semibold mb-2">1-Month Trial</h2>
                    <p className="text-gray-600">Get started with all features</p>
                    <p className="text-green-600 font-bold text-2xl mt-2">₹1</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                        onClick={() => handleSubscription("trial")}
                        disabled={loading}
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
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Subscribe Now"}
                    </button>
                </div>
            </div>

            {/* Prefill Info Display */}
            {adminDetails && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
                    <h3 className="font-semibold">Your Details</h3>
                    <p>Name: {adminDetails.name}</p>
                    <p>Email: {adminDetails.email}</p>
                    <p>Mobile: {adminDetails.mobile}</p>
                </div>
            )}
        </div>
    );
}
