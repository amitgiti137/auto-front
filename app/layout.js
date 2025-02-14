import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LeftSidebar from "./component/LeftSidebar";
import Header from "./component/Header";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Wrap everything inside AuthProvider */}
        <AuthProvider>
          <Header />
          <LeftSidebar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
