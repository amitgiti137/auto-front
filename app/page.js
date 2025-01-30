import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1>Welcome to Automate Business</h1>
        <p>Streamline your business operations with task management, employee collaboration, and more.</p>
        <div style={{ marginTop: '20px' }}>
            <Link href="/login">
                <button style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}>Log In</button>
            </Link>
        </div>
    </header>

    <main>
        <h2>Why Choose Automate Business?</h2>
        <ul style={{ lineHeight: '1.8' }}>
            <li>🗂 Easily assign and track tasks across your team.</li>
            <li>👥 Manage employees and their roles effortlessly.</li>
            <li>📈 Increase productivity with automated workflows.</li>
            <li>💬 Get real-time updates from your employees.</li>
        </ul>
    </main>

    <footer style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #ccc', padding: '10px' }}>
        <p>© 2024 Automate Business. All Rights Reserved.</p>
    </footer>
</div>
  );
}
