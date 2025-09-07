// src/app/admin/(panel)/(components)/AdminHeader.tsx
"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';

const AdminHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const pathParts = pathname.split('/').filter(p => p);
    if (pathname.includes('/edit')) return "Edit";
    if (pathname.includes('/new')) return "Create New";
    if (pathParts.length < 2) return "Dashboard";
    const title = pathParts[1];
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    Cookies.remove('auth-signal'); // Hapus cookie sinyal
    window.location.href = '/login';
  };

  return (
    <header className="flex justify-between items-center h-[69px] py-4 px-8 border-b border-slate/30 bg-white sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-bold text-dark-navy">{getPageTitle()}</h1>
      </div>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            className="rounded-full"
            src="https://i.pravatar.cc/40"
            alt="Admin Avatar"
            width={40}
            height={40}
            priority />

          {/* <img 
            src="https://i.pravatar.cc/40" 
            alt="Admin"
            className="w-10 h-10 rounded-full"
          /> */}
          <div>
            <p className="font-semibold text-sm text-dark-navy">Admin Scuba</p>
            <p className="text-xs text-slate">admin@menjanganscuba.com</p>
          </div>
          <ChevronDown size={16} className="text-slate" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-slate/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate/10 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;