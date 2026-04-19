'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../lib/api';

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ courses: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'instructor') {
      fetchStats();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/courses/instructor/stats');
      if (res.data.success) {
        setStats({ 
          courses: res.data.data.courses,
          totalStudents: res.data.data.totalStudents
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="text-center py-20">Loading...</div>;

  if (user?.role !== 'instructor') {
    return <div className="text-center py-20 text-red-500">Access denied. Instructor only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your courses and students</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button>+ Create New Course</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
          <h3 className="text-indigo-100 font-medium pb-2">Total Courses</h3>
          <p className="text-4xl font-bold">{stats.courses}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <h3 className="text-purple-100 font-medium pb-2">Total Students</h3>
          <p className="text-4xl font-bold">{stats.totalStudents}</p>
        </Card>
        <Card className="p-6 flex flex-col justify-center items-center border-dashed border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
          <Link href="/instructor/courses/new" className="text-center w-full">
            <span className="text-3xl mb-2 block text-indigo-400">+</span>
            <span className="font-semibold text-indigo-700">Create Course</span>
          </Link>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/instructor/courses" className="p-4 border rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all group">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 flex items-center">
              Manage Courses
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
            </h3>
            <p className="text-sm text-gray-500 mt-1">Edit content or add new lessons</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
