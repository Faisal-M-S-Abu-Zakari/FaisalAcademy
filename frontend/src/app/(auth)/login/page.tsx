'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) login(res.data.data.token, res.data.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-purple-600 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold gradient-text-gold">Faisal Academy</span>
          </Link>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome back to your learning journey</h2>
          <p className="text-indigo-200 mb-10 leading-relaxed">Thousands of students are learning right now. Log in and continue where you left off.</p>
          <div className="space-y-4">
            {[
              { icon: BookOpen, text: '200+ premium courses' },
              { icon: Users,    text: '10,000+ active learners' },
              { icon: Award,    text: 'Certified upon completion' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text">Faisal Academy</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in to your account</h1>
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign up for free
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none font-bold shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <Link href="#" className="underline hover:text-indigo-500">Terms</Link>
              {' '}and{' '}
              <Link href="#" className="underline hover:text-indigo-500">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
