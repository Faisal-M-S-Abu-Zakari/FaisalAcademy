'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

export default function ManageComments() {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchAllComments();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchAllComments = async () => {
    try {
      const res = await api.get('/comments/all');
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (authLoading || loading) return <div className="text-center py-20">Loading...</div>;

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500">Access denied. Admin only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Comments</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No comments found.
                </td>
              </tr>
            ) : (
              comments.map(comment => (
                <tr key={comment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 line-clamp-2">{comment.text}</p>
                    <div className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.course?.title || 'Unknown Course'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <img className="h-6 w-6 rounded-full" src={comment.user?.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} />
                       <span className="text-sm font-medium text-gray-900">{comment.user?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(comment._id)} className="text-red-600 hover:text-red-900 font-semibold">
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
