"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);

    /* useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://automate-business-backend.vercel.app/api/tasks/your-user-id', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data);
        };
        fetchTasks();
    }, []); */

    return (
        <div>
            {/* <h1>Dashboard</h1>
            {tasks.map((task) => (
                <div key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                </div>
            ))} */}

            <section className="mt-28 mx-[8 px] lg:mx-[125px]">
                <div className="container mx-auto">
                    <div className="flex justify-center items-center">
                        <div className="w-full md:w-[24%] lg:w-[24%] bg-[#e3e3e3] rounded-md mb-5">
                            <div className="flex justify-start pb-3 mt-3">
                                <div className="pl-3 mr-3">
                                    <p className="text-[#000000] text-[14px] pb-3">Your App Usage Progress</p>
                                    <div className="w-20">
                                        <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-1 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF] text-[12px] rounded-md">Checklist</Link>
                                    </div>
                                </div>
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle className="text-[#FFF]" strokeWidth="2" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                        <circle className="text-[#A9B5DF] rounded-lg"strokeWidth="5" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"
                                            strokeDasharray="251.2" strokeDashoffset="138.16" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[#00000] text-sm font-medium">
                                        45%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-start gap-3">

                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] bg-[#A9B5DF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                                    </svg>
                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">Tasks</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">Delegate one time and recurring tasks to your team</p>
                                </div>
                            </div>
                            <Link href="/my-tasks" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Go To Task Management</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
                                    </svg>
                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">Intranet</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">manage all your important company links.</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 mt-3 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Go To Intranet</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                                    </svg>
                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">leaves</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">Manage your employee leaves and holidays.</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Start Trial</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M4 9.05H3v2h1v-2Zm16 2h1v-2h-1v2ZM10 14a1 1 0 1 0 0 2v-2Zm4 2a1 1 0 1 0 0-2v2Zm-3 1a1 1 0 1 0 2 0h-2Zm2-4a1 1 0 1 0-2 0h2Zm-2-5.95a1 1 0 1 0 2 0h-2Zm2-3a1 1 0 1 0-2 0h2Zm-7 3a1 1 0 0 0 2 0H6Zm2-3a1 1 0 1 0-2 0h2Zm8 3a1 1 0 1 0 2 0h-2Zm2-3a1 1 0 1 0-2 0h2Zm-13 3h14v-2H5v2Zm14 0v12h2v-12h-2Zm0 12H5v2h14v-2Zm-14 0v-12H3v12h2Zm0 0H3a2 2 0 0 0 2 2v-2Zm14 0v2a2 2 0 0 0 2-2h-2Zm0-12h2a2 2 0 0 0-2-2v2Zm-14-2a2 2 0 0 0-2 2h2v-2Zm-1 6h16v-2H4v2ZM10 16h4v-2h-4v2Zm3 1v-4h-2v4h2Zm0-9.95v-3h-2v3h2Zm-5 0v-3H6v3h2Zm10 0v-3h-2v3h2Z" />
                                    </svg>

                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">Attend</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">Track your team's Attendance and Breaks Breaks.</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Start Trial</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
                                    </svg>

                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">CRM</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">track and Convert and assign leads to your sales team.</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Go To CRM</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clipRule="evenodd" />
                                        <path fill="currentColor" d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z" />
                                    </svg>

                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Automate<span className="text-blue-500">WA</span></h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">Offical WhatsApp API for all Busniess Communication</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Go To WhatsApp API</Link>
                        </div>
                        <div className="w-full md:w-[24%] bg-[#e3e3e3] rounded-md overflow-hidden">
                            <div className="flex justify-center items-center pb-3 mt-3">
                                <div className="flex items-center justify-center p-3 bg-[#A9B5DF] rounded-md ml-3">
                                    <svg className="w-6 h-6 text-[#FFF] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
                                    </svg>
                                </div>
                                <div className="pl-3">
                                    <h6 className="text-[#000000] text-[20px] font-normal">Tutorials</h6>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">learn how to get best out of Business Workspace</p>
                                </div>
                            </div>
                            <Link href="#" className="text-[#FFF] hover:text-[#000000] text-center flex justify-around py-2 bg-[#A9B5DF] hover:bg-[#e3e3e3] border-2 border-[#A9B5DF]">Go To Tutorial</Link>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
