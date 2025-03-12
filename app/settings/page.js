"use client";

import React, { useState } from "react";
import SubscriptionPage from "../component/Subscription";
import Subscription from "../component/EzzBuzz"; // Import the EzzBuzz Component

export default function Page() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Subscription Options</h1>

            {/* Buttons to Choose Subscription Type */}
            <div className="flex gap-4">
                <button
                    className={`px-6 py-2 rounded text-white ${
                        activeComponent === "SubscriptionPage" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    onClick={() => setActiveComponent("SubscriptionPage")}
                >
                    Razorpay Payment
                </button>

                <button
                    className={`px-6 py-2 rounded text-white ${
                        activeComponent === "Subscription" ? "bg-green-600" : "bg-green-500 hover:bg-green-700"
                    }`}
                    onClick={() => setActiveComponent("Subscription")}
                >
                    EzzBuzz Payment
                </button>
            </div>

            {/* Conditionally Render Components */}
            <div className="mt-6 w-full flex justify-center">
                {activeComponent === "SubscriptionPage" && <SubscriptionPage />}
                {activeComponent === "Subscription" && <Subscription />}
            </div>
        </div>
    );
}
