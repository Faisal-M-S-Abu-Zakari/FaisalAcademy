'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { CourseCard } from '../../components/CourseCard';
import api from '../../lib/api';
import { Course } from '../../types';
import { BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses]          = useState<Course[]>([]);
  const [loading, setLoading]          = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (!authLoading && user?.role === 'student') fetchStudentCourses();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  const fetchStudentCourses = async () => {
    try {
      const res = await api.get('/courses');
      if (res.data.success) {
        const ids = (user?.enrolledCourses || []).map((c: any) => c._id || c);
        setCourses(res.data.data.filter((c: Course) => ids.includes(c._id)));
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="skeleton h-10 w-64 mb-4 rounded-xl" />
        <div className="skeleton h-5 w-40 mb-10 rounded-xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <GraduationCap className="w-16 h-16 text-indigo-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your dashboard.</p>
        <Link href="/login"><Button>Log In</Button></Link>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome banner */}
      <div className="w-full py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 opacity-10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-indigo-300 text-sm font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="gradient-text-gold">{user.name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-indigo-200 mt-2 capitalize">
              {user.role} Dashboard
              {courses.length > 0 && (
                <span className="ml-2 text-indigo-300">· {courses.length} course{courses.length > 1 ? 's' : ''} enrolled</span>
              )}
            </p>
          </div>
          <Link href="/courses">
            <Button className="bg-indigo-600 text-white border-none font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick stats - only for students */}
        {user.role === 'student' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: BookOpen,     label: 'Enrolled',       value: courses.length,   color: 'from-indigo-500 to-indigo-600' },
              { icon: TrendingUp,   label: 'In Progress',    value: courses.length,   color: 'from-purple-500 to-purple-600' },
              { icon: GraduationCap,label: 'Completed',      value: 0,                color: 'from-amber-500 to-amber-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-md`}>
                <Icon className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-3xl font-extrabold">{value}</p>
                <p className="text-xs opacity-80 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Courses section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
            {courses.length > 0 && (
              <Link href="/courses" className="text-sm text-indigo-600 font-semibold hover:underline">
                Discover more →
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 p-16 rounded-2xl border border-indigo-100">
              <BookOpen className="w-16 h-16 text-indigo-200 mx-auto mb-5" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Browse our catalog and enroll in your first course. It's completely free to get started!</p>
              <Link href="/courses">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg font-bold hover:shadow-indigo-200 hover:shadow-xl transition-all duration-300">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
