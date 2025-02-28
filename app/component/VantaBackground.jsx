"use client"; // ✅ Ensures this runs only on the client side

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three"; // ✅ Import three.js directly

// ✅ Dynamically import Vanta.js to prevent SSR issues
const NET = dynamic(() => import("vanta/dist/vanta.net.min"), { ssr: false });

const VantaBackground = () => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                NET({
                    el: vantaRef.current,
                    THREE: THREE, // ✅ Pass THREE explicitly
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0xff3f81, // Custom color
                    backgroundColor: 0x23153c, // Custom background color
                    points: 10, // Number of connection points
                    maxDistance: 20, // Max distance between points
                    spacing: 15, // Space between points
                    showDots: true // Show dots
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return <div ref={vantaRef} className="absolute top-0 left-0 w-full h-screen"></div>;
};

export default VantaBackground;
