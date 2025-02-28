import VantaBackground from "../component/VantaBackground";

export default function Home() {
    return (
        <div className="relative flex items-center justify-center h-screen text-white">
            {/* Vanta.js Background */}
            <VantaBackground />

            {/* Page Content */}
            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold">Welcome to Vanta.js in Next.js</h1>
                <p className="text-lg mt-3">This background is powered by Vanta.js NET animation.</p>
            </div>
        </div>
    );
}
