"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiMenu, FiX, FiHome, FiClipboard, 
  FiUsers, FiSettings, FiCreditCard, FiHelpCircle 
} from "react-icons/fi";

export default function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();


  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-1 left-4 z-50 p-2 bg-green-500 text-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={10} /> : <FiMenu size={10} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-full bg-[#ad9e9e] transition-transform transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-[5%] w-[25%] md:w-[8%] shadow-lg z-40 p-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center mt-5 lg:mt-0 px-1 py-2">
          <img src="/img/logo.jpg" alt="Logo" className="h-12" />
        </div>

        {/* Navigation Links */}
        <nav className="mt-0 text-white flex flex-col items-center space-y-0">
          <NavItem href="/myapp" icon={<FiHome />} text="App" pathname={pathname} closeSidebar={() => setIsOpen(false)}/>
          <NavItem href="/my-tasks" icon={<FiClipboard />} text="Tasks" pathname={pathname} isTaskSection closeSidebar={() => setIsOpen(false)}/>
          <NavItem href="/myteam" icon={<FiUsers />} text="Team" pathname={pathname} closeSidebar={() => setIsOpen(false)}/>
          <NavItem href="/settings" icon={<FiSettings />} text="Settings" pathname={pathname} closeSidebar={() => setIsOpen(false)}/>
          <NavItem href="/billing" icon={<FiCreditCard />} text="Billing" pathname={pathname} closeSidebar={() => setIsOpen(false)}/>
          <NavItem href="/support" icon={<FiHelpCircle />} text="Support" pathname={pathname} closeSidebar={() => setIsOpen(false)}/>
        </nav>
      </aside>

      {/* Background Overlay (Mobile) */}
      {/* {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)}></div>
      )} */}
    </>
  );
}

// Navigation Item Component with Icons Above Text
const NavItem = ({ href, icon, text, pathname, isTaskSection, closeSidebar }) => {
  // Keep "Tasks" active if pathname starts with "/my-tasks" or "/task-dashboard"
  const isActive = isTaskSection
    ? pathname.startsWith("/my-tasks") || pathname.startsWith("/task-") // All task-related pages
    : pathname === href;

  return (
    <Link href={href} passHref>
      <div className={`flex flex-col items-center space-y-1 px-3 py-3 hover:bg-gray-300 transition rounded-md text-[12px] cursor-pointer
        ${isActive ? "bg-white text-[#C8AAAA] font-bold" : ""}`}
        onClick={closeSidebar} // Close sidebar on click
        >
        <span className="text-lg">{icon}</span> {/* Icon */}
        <span className="text-[12px]">{text}</span> {/* Text Below Icon */}
      </div>
    </Link>
  );
};
