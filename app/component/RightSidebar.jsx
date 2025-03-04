"use client"

import { useState } from "react";
import { FiList, FiChevronRight, FiClipboard, FiUsers, FiFolder } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AssignTask from "./AssignTask";

export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  /* const pathname = usePathname(); */

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button 
        className="lg:hidden fixed top-1 left-[15%] p-2 z-50 bg-gray-800 text-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronRight size={10} /> : <FiList size={10} />}
      </button>

      {/* Right Sidebar Container */}
      <aside className={`fixed top-0 lg:left-[5%] left-0 h-full bg-gradient-to-r from-[#ad9e9e] to-[#C8AAAA] transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-[11%] w-[75%] shadow-lg z-40 p-1`}>
        {/* <h2 className="text-md font-bold text-gray-900 mb-4">Task Management</h2> */}
        
        <nav className="mt-16 text-gray-700">
          <TaskItem text="Assign Task" icon={<FiClipboard/>} 
          onClick={() => {
            setIsPopupOpen(true); // Open popup
            setIsOpen(false); // Close sidebar
          }}
          />
          <TaskItem href="/task-dashboard" text="Dashboard" icon={<FiList />} closeSidebar={() => setIsOpen(false)}/>
          <TaskItem href="/my-tasks" text="My Tasks" icon={<FiUsers />} closeSidebar={() => setIsOpen(false)}/>
          <TaskItem href="/task-delegated" text="Delegated Tasks" icon={<FiClipboard />} closeSidebar={() => setIsOpen(false)}/>
          <TaskItem href="/task-all" text="All Tasks" icon={<FiFolder />} closeSidebar={() => setIsOpen(false)}/>
          <TaskItem href="/task-templates" text="Task Templates" icon={<FiClipboard />} closeSidebar={() => setIsOpen(false)}/>
          <TaskItem href="/task-directory" text="Task Directory" icon={<FiFolder />} closeSidebar={() => setIsOpen(false)}/>
        </nav>
      </aside>

      {/* Background Overlay (Mobile) */}
      {/* {isOpen && <div className="fixed inset-0 bg-black lg:hidden" onClick={() => setIsOpen(false)}></div>} */}
      <AssignTask isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
    </>
  );
}

// Task Navigation Item Component
const TaskItem = ({ href, text, icon, closeSidebar, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return href ? (
    <Link href={href} passHref>
      <div 
        className={`flex items-center space-x-3 px-2 py-3 hover:bg-gray-300 transition rounded-lg text-[12px] ${isActive ? "bg-[#aedaa9] font-bold w-[90%]" : "w-[95%]"}`}
        onClick={closeSidebar} // Close sidebar on click
      >
        <span>{icon}</span>
        <span>{text}</span>
      </div>
    </Link>
  ) : (
    <div 
      className="flex items-center space-x-3 px-2 py-3 hover:bg-gray-300 transition rounded-lg text-[12px] w-[95%]"
      onClick={onClick} // Call onClick for Assign Task
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};
