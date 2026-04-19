'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500">Access denied. Admin only.</div>;
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: BarChart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed z-50 bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 h-screen md:h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 pb-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Admin Dashboard</h2>
        </div>
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
