// src/app/admin/(panel)/(components)/Sidebar.tsx
"use client";
import { ChevronLeft, FileText, Fish, ImageIcon, LayoutDashboard, MessageSquare, Package, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/submissions', label: 'Submissions', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: MessageSquare },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    // Menggunakan 'bg-navy' yang sudah ada, ini benar
    <aside className={`bg-navy text-white h-screen flex flex-col sticky top-0 transition-all duration-300 z-50 ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-light-navy/20 h-[69px]">
        {!isMinimized && (
          <Link href="/" className="flex items-center gap-1 opacity-100 transition-opacity duration-300">
            <span className="font-black text-white">MENJANGAN</span>
            <Fish className="w-5 h-5 text-bright-blue transform -rotate-45" />
            <span className="font-black text-white">SCUBA</span>
          </Link>
        )}
        <button 
          onClick={() => setIsMinimized(!isMinimized)} 
          className={`text-slate hover:text-white p-1 te rounded-full hover:bg-light-navy/50 transition-all duration-300 ${isMinimized ? 'w-full' : ''}`}
        >
          <ChevronLeft size={20} className={`transition-transform duration-300 mx-auto ${isMinimized ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              title={isMinimized ? link.label : ''}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-500 text-white font-bold'
                    : 'text-light-slate hover:text-blue-400'
              } ${isMinimized ? 'justify-center' : ''}`}
            >
              <link.icon size={20} />
              {!isMinimized && <span className="truncate">{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* <div className="p-4 border-t border-light-navy/20">
        <Link 
          href="/admin/settings"
          title={isMinimized ? "Settings" : ''}
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              pathname.startsWith('/admin/settings') 
                ? 'bg-bright-blue text-dark-navy font-bold' 
                : 'text-light-slate hover:bg-light-navy/50 hover:text-white'
          } ${isMinimized ? 'justify-center' : ''}`}
        >
          <Settings size={20} />
          {!isMinimized && <span>Settings</span>}
        </Link>
      </div> */}
    </aside>
  );
};

export default Sidebar;