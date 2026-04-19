'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Globe, Share2, AtSign, Mail, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await api.post('/newsletter', { email });
      if (res.data.success) {
        setStatus('success');
        setEmail('');
        if (res.data.previewUrl) console.log('Email preview URL:', res.data.previewUrl);
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto text-gray-300">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500" />

      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold gradient-text">Faisal Academy</span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Empowering students and creators around the globe through accessible, high-quality education.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Globe,  href: '#' },
                { Icon: Share2, href: '#' },
                { Icon: AtSign, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'All Courses', href: '/courses' },
                { label: 'About Us', href: '/about' },
                { label: 'Top Instructors', href: '#' },
                { label: 'Categories', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Faisal Academy', href: '/about' },
                { label: 'Careers', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get the latest courses, tips, and offers straight to your inbox.
            </p>
            {status === 'success' ? (
              <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-400 text-sm px-4 py-3 rounded-xl">
                🎉 You're subscribed to Faisal Academy!
              </div>
            ) : (
              <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                <div className="flex rounded-xl overflow-hidden border border-gray-700 focus-within:border-indigo-500 transition-colors">
                  <div className="flex items-center pl-3 text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === 'loading'}
                    className="bg-gray-900 text-sm text-white px-3 py-2.5 w-full focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 transition-colors text-sm font-medium disabled:opacity-50 flex items-center"
                  >
                    {status === 'loading' ? '...' : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-xs">Failed to subscribe. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-indigo-400 font-medium">Faisal Academy</span>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built with ❤️ for learning
          </p>
        </div>
      </div>
    </footer>
  );
};
