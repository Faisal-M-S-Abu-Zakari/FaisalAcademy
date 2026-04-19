'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { X, Menu, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/courses', label: 'Browse Courses' },
    { href: '/about', label: 'About' },
    { href: '/#features', label: 'Features' },
    { href: '/#testimonials', label: 'Testimonials' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-indigo-100/60'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold gradient-text tracking-tight">
                Faisal Academy
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-50 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 font-medium hidden md:block">
                  Hi, <span className="text-indigo-600 font-semibold">{user.name?.split(' ')[0]}</span>
                </span>
                <Link href={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard'}>
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="primary" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-md hover:shadow-indigo-200 hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-5 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard'} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="primary" className="w-full" onClick={() => { logout(); setMobileOpen(false); }}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
