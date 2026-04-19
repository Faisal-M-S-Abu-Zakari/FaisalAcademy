'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { User, Course } from '../../types';
import { Users, BookOpen, MessageSquare, TrendingUp, Activity, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes, commentsRes] = await Promise.allSettled([
        api.get('/users'),
        api.get('/courses'),
        api.get('/comments/all')
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        setUsers(usersRes.value.data.data);
      }
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data.success) {
        setCourses(coursesRes.value.data.data);
      }
      if (commentsRes.status === 'fulfilled' && commentsRes.value.data.success) {
        setComments(commentsRes.value.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Activity className="animate-spin w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  // Calculate some dummy / actual stats
  const students = users.filter(u => u.role === 'student').length;
  const instructors = users.filter(u => u.role === 'instructor').length;
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Courses</p>
            <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Comments</p>
            <h3 className="text-2xl font-bold text-gray-900">{comments.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Instructors</p>
            <h3 className="text-2xl font-bold text-gray-900">{instructors}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
            <Link href="/admin/users" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map(u => (
              <div key={u._id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <UserPlus size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{u.name}</h4>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
                  ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : ''}
                  ${u.role === 'instructor' ? 'bg-blue-50 text-blue-700' : ''}
                  ${u.role === 'student' ? 'bg-green-50 text-green-700' : ''}
                `}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Database Status</span>
                <span className="text-green-600 font-semibold">Connected</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Server Load</span>
                <span className="text-gray-900 font-semibold">Healthy</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
