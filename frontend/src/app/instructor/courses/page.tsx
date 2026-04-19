'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import api from '../../../lib/api';
import { Course } from '../../../types';

export default function InstructorCourses() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'instructor') {
      fetchMyCourses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchMyCourses = async () => {
    try {
      const res = await api.get('/courses');
      if (res.data.success) {
        const myCourses = res.data.data.filter((c: any) => 
          c.instructor._id === user?._id || c.instructor === user?._id
        );
        setCourses(myCourses);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (authLoading || loading) return <div className="text-center py-20">Loading...</div>;

  if (user?.role !== 'instructor') {
    return <div className="text-center py-20 text-red-500">Access denied. Instructor only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
        <Link href="/instructor/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  You haven't created any courses yet.
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {course.lessons?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link href={`/courses/${course._id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                    <Link href={`/instructor/courses/${course._id}/edit`} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
