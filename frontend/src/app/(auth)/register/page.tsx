'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'student' | 'instructor'>('student');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data.success) login(res.data.data.token, res.data.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] right-[10%] w-64 h-64 bg-emerald-400 rounded-full opacity-15 blur-3xl animate-pulse" />
          <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white">Faisal Academy</span>
          </Link>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Start your learning journey today — it's free</h2>
          <p className="text-emerald-100 mb-10 leading-relaxed">Join over 10,000 students and 50+ instructors already building skills on Faisal Academy.</p>
          <div className="space-y-4">
            {[
              { icon: BookOpen, text: 'Unlimited course browsing' },
              { icon: Users,    text: 'Active learner community' },
              { icon: Award,    text: 'Earn certificates you can share' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-emerald-100">
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
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Password (min. 6 characters)" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I want to join as a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['student', 'instructor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 ${
                        role === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-500 hover:border-indigo-300'
                      }`}
                    >
                      {r === 'student' ? '🎓 Student' : '📚 Instructor'}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none font-bold shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Creating account…' : 'Create Free Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-400">
              By signing up, you agree to our{' '}
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
